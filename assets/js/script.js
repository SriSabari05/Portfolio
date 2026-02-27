document.addEventListener('DOMContentLoaded', () => {
    const heroImage = document.getElementById('heroImage');
    const heroContent = document.getElementById('heroContent');

    // Sequence
    // 1. Animation runs for 1.8s, flying image from bottom to center with spin

    // 2. After animation ends, ensure center state is set (safety reset)
    setTimeout(() => {
        heroImage.classList.add('center');
    }, 1900); // Just after 1.8s animation

    // 3. Move image to right side
    setTimeout(() => {
        heroImage.classList.add('right');
    }, 2400); // 0.5s after center

    // 4. Show content after image moves right
    setTimeout(() => {
        heroContent.classList.add('show');
        document.getElementById('navbar').classList.add('show');
    }, 3000); // Show text and nav as image arrives at right

    // Intersection Observer for Sections
    const observerOptions = {
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // About Section
                if (entry.target.id === 'about') {
                    const img = entry.target.querySelector('.about-img');
                    const content = entry.target.querySelector('.about-content-wrapper');
                    if (img) img.classList.add('active');
                    if (content) content.classList.add('active');
                    observer.unobserve(entry.target);
                }

                // Skills Section
                if (entry.target.id === 'skills') {
                    // Staggered Fly-in for Skill Items
                    const skillItems = entry.target.querySelectorAll('.skill-entry');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('active');
                        }, index * 200); // 200ms delay per item
                    });

                    // Progress Bars
                    const progressBars = entry.target.querySelectorAll('.progress-bar');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                    });

                    const percentSpans = entry.target.querySelectorAll('.skill-percent');
                    percentSpans.forEach(span => {
                        const target = +span.getAttribute('data-target');
                        const duration = 1500; // ms
                        const increment = target / (duration / 16); // 60fps

                        let current = 0;
                        const updateCount = () => {
                            current += increment;
                            if (current < target) {
                                span.innerText = Math.ceil(current) + '%';
                                requestAnimationFrame(updateCount);
                            } else {
                                span.innerText = target + '%';
                            }
                        };
                        updateCount();
                    });
                    observer.unobserve(entry.target);
                }


            }
        });
    }, observerOptions);

    const aboutSection = document.getElementById('about');
    const skillsSection = document.getElementById('skills');
    const projectsSection = document.getElementById('projects');
    const contactSection = document.getElementById('contact');

    const sections = [aboutSection, skillsSection, projectsSection, contactSection];
    sections.forEach(section => {
        if (section) {
            section.classList.add('reveal');
            observer.observe(section);
        }
    });

    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        if (section) observer2.observe(section);
    });
    // Mobile Menu Logic
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.getElementById('navLinks');
    const navItems = navLinks.querySelectorAll('a');

    const toggleMenu = (state) => {
        if (typeof state === 'boolean') {
            menuToggle.classList.toggle('active', state);
            navLinks.classList.toggle('active', state);
            document.body.style.overflow = state ? 'hidden' : ''; // Prevent scroll when menu open
        } else {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => toggleMenu(false));
    });

    // Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.send-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formMessage.innerText = 'Message sent successfully! 🚀';
                    formMessage.className = 'contact-message success';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formMessage.innerText = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formMessage.innerText = 'Oops! There was a problem submitting your form';
                    }
                    formMessage.className = 'contact-message error';
                    formMessage.style.display = 'block';
                }
            } catch (error) {
                formMessage.innerText = 'Oops! There was a problem submitting your form';
                formMessage.className = 'contact-message error';
                formMessage.style.display = 'block';
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
    }
});

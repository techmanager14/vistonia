// Role requirements data
const roleRequirements = {
    'call-caller': {
        title: 'Call Caller Requirements',
        requirements: [
            'Excellent communication skills',
            'Previous sales experience preferred',
            'Ability to work under pressure',
            'Basic computer knowledge'
        ]
    },
    'hr-executive': {
        title: 'HR Executive Requirements',
        requirements: [
            'Bachelor\'s degree in HR or related field',
            '3+ years of HR experience',
            'Strong interpersonal skills',
            'Knowledge of HRIS systems'
        ]
    },
    'other': {
        title: 'General Requirements',
        requirements: [
            'Relevant experience in chosen field',
            'Strong problem-solving abilities',
            'Team player mentality',
            'Willingness to learn and grow'
        ]
    }
};

// Form elements
const form = document.getElementById('jobApplicationForm');
const positionSelect = document.getElementById('position');
const roleRequirementsDiv = document.getElementById('roleRequirements');
const successMessage = document.getElementById('successMessage');
const newsletterForm = document.getElementById('newsletterForm');

// Google Apps Script Web App URL (Replace with your actual URL)
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

// File upload handling
const fileUpload = document.getElementById('resume');
const fileUploadWrapper = fileUpload.parentElement;
const fileUploadInfo = fileUploadWrapper.querySelector('.file-upload-info');

fileUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            this.value = '';
            fileUploadWrapper.classList.remove('has-file');
            return;
        }

        // Check file type
        const validTypes = ['.pdf', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!validTypes.includes(fileExtension)) {
            alert('Please upload a PDF, DOC, or DOCX file');
            this.value = '';
            fileUploadWrapper.classList.remove('has-file');
            return;
        }

        // Update UI
        fileUploadWrapper.classList.add('has-file');
        fileUploadInfo.querySelector('span').textContent = file.name;
    } else {
        fileUploadWrapper.classList.remove('has-file');
        fileUploadInfo.querySelector('span').textContent = 'Choose a file or drag it here';
    }
});

// Drag and drop handling
fileUploadWrapper.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
});

fileUploadWrapper.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
});

fileUploadWrapper.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
        fileUpload.files = e.dataTransfer.files;
        fileUpload.dispatchEvent(new Event('change'));
    }
});

// Handle position change
positionSelect.addEventListener('change', function() {
    const selectedRole = this.value;
    if (selectedRole && roleRequirements[selectedRole]) {
        const requirements = roleRequirements[selectedRole];
        roleRequirementsDiv.innerHTML = `
            <h4>${requirements.title}</h4>
            <ul>
                ${requirements.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        `;
        roleRequirementsDiv.style.display = 'block';
    } else {
        roleRequirementsDiv.style.display = 'none';
    }
});

// Update form validation
function validateForm(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const position = formData.get('position');
    const resume = formData.get('resume');

    // Basic validation
    if (name.length < 2) {
        throw new Error('Please enter a valid name');
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Please enter a valid email address');
    }

    if (!phone.match(/^\+?[\d\s-]{10,}$/)) {
        throw new Error('Please enter a valid phone number');
    }

    if (!position) {
        throw new Error('Please select a position');
    }

    // File validation
    if (resume && resume.size > 5 * 1024 * 1024) {
        throw new Error('Resume file size must be less than 5MB');
    }

    return true;
}

// Handle form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(form);
        
        // Validate form
        validateForm(formData);

        // Prepare data for submission
        const submissionData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            position: formData.get('position'),
            resume: formData.get('resume') ? formData.get('resume').name : 'Not provided'
        };

        // Send data to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(submissionData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Show success message
        successMessage.textContent = 'Thank you for your application! We will contact you soon.';
        successMessage.style.display = 'block';
        
        // Reset form
        form.reset();
        roleRequirementsDiv.style.display = 'none';
        fileUploadWrapper.classList.remove('has-file');
        fileUploadInfo.querySelector('span').textContent = 'Choose a file or drag it here';

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

    } catch (error) {
        alert(error.message);
    }
});

// Newsletter form submission
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            // Here you would typically send this to your server
            // For now, we'll just show a success message
            const button = this.querySelector('button');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                emailInput.value = '';
            }, 2000);
        } else {
            alert('Please enter a valid email address');
        }
    });
}

// Add smooth scroll animation for all sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation on scroll
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.company-info, .company-image, .role-card, .connection-item, .social-connect');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('animate');
        }
    });
};

// Run animation check on load and scroll
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // File upload handling
    const fileUpload = document.querySelector('.file-upload');
    const fileUploadInfo = document.querySelector('.file-upload-info');
    
    if (fileUpload) {
        fileUpload.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                const fileSize = this.files[0].size;
                
                // Check file size (5MB limit)
                if (fileSize > 5 * 1024 * 1024) {
                    alert('File size exceeds 5MB limit. Please choose a smaller file.');
                    this.value = '';
                    return;
                }
                
                // Update the file upload info
                fileUploadInfo.innerHTML = `
                    <i class="fas fa-file-alt"></i>
                    <span>${fileName}</span>
                    <small>${(fileSize / 1024).toFixed(2)} KB</small>
                `;
                
                // Add a class to indicate a file has been selected
                fileUploadInfo.parentElement.classList.add('has-file');
            } else {
                // Reset the file upload info
                fileUploadInfo.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>Choose a file or drag it here</span>
                    <small>Maximum file size: 5MB</small>
                `;
                
                // Remove the class indicating a file has been selected
                fileUploadInfo.parentElement.classList.remove('has-file');
            }
        });
        
        // Drag and drop functionality
        fileUploadInfo.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        fileUploadInfo.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        fileUploadInfo.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                fileUpload.files = e.dataTransfer.files;
                const event = new Event('change');
                fileUpload.dispatchEvent(event);
            }
        });
    }

    // Form submission handling
    const jobApplicationForm = document.getElementById('jobApplicationForm');
    const successMessage = document.getElementById('successMessage');
    
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const position = document.getElementById('position').value;
            const resume = document.getElementById('resume').files.length;
            
            if (!name || !email || !phone || !position || !resume) {
                alert('Please fill in all required fields and upload your resume.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            // In a real application, you would send the form data to a server here
            // For this demo, we'll just show a success message
            
            // Hide the form
            jobApplicationForm.style.display = 'none';
            
            // Show success message
            successMessage.textContent = 'Thank you for your application! We will contact you soon.';
            successMessage.style.display = 'block';
            
            // Reset form for future submissions
            setTimeout(() => {
                jobApplicationForm.reset();
                jobApplicationForm.style.display = 'block';
                successMessage.style.display = 'none';
                
                // Reset file upload info
                if (fileUploadInfo) {
                    fileUploadInfo.innerHTML = `
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Choose a file or drag it here</span>
                        <small>Maximum file size: 5MB</small>
                    `;
                    fileUploadInfo.parentElement.classList.remove('has-file');
                }
            }, 5000);
        });
    }

    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value.trim();
            
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // In a real application, you would send the email to a server here
            // For this demo, we'll just show a success message
            
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }

    // Add animation classes when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.company-info, .company-image, .role-card, .benefit-item, .connection-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    // Run on initial load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}); 
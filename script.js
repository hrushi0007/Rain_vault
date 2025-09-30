// RainVault JavaScript - Enhanced Rain Animation - Mobile Optimized

// Rainfall data for Indian cities (mm per year)
const rainfallData = {
    'mumbai': 2200,
    'delhi': 790,
    'bangalore': 970,
    'bengaluru': 970,
    'kolkata': 1580,
    'chennai': 1400,
    'hyderabad': 810,
    'pune': 720,
    'ahmedabad': 800,
    'jaipur': 650,
    'lucknow': 980,
    'kanpur': 860,
    'nagpur': 1200,
    'visakhapatnam': 1100,
    'vizag': 1100,
    'bhopal': 1200,
    'patna': 1200,
    'vadodara': 900,
    'ghaziabad': 790,
    'ludhiana': 700,
    'agra': 650,
    'nashik': 600,
    'coimbatore': 650,
    'madurai': 850,
    'kochi': 3000,
    'thiruvananthapuram': 1800,
    'bhubaneswar': 1450,
    'guwahati': 1800,
    'chandigarh': 1100,
    'mysore': 800,
    'indore': 950,
    'surat': 1200,
    'rajkot': 600,
    'jabalpur': 1350,
    'gwalior': 850
};

// Rooftop runoff coefficients
const rooftopCoefficients = {
    'metal': 0.95,
    'tile': 0.85,
    'asphalt': 0.75,
    'flat-concrete': 0.80,
    'green': 0.30,
    'gravel': 0.65
};

// Average daily water consumption per person (liters)
const dailyWaterConsumptionPerPerson = 135; // WHO recommended

// Mobile detection
const isMobile = () => {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Enhanced mobile menu functions with better accessibility
function toggleMobileMenu() {
    const overlay = document.getElementById('mobile-menu-overlay');
    const menu = document.getElementById('mobile-menu');
    
    if (!overlay || !menu) return;
    
    const isActive = overlay.classList.contains('active');
    
    if (isActive) {
        // Close menu
        overlay.classList.remove('active');
        menu.classList.remove('active');
        menu.style.transform = 'translateX(100%)';
        document.body.style.overflow = '';
        
        // Remove event listeners
        document.removeEventListener('keydown', handleMenuKeyDown);
        document.removeEventListener('click', handleOutsideClick);
        
        // Restore focus to menu button
        const menuButton = document.querySelector('[onclick="toggleMobileMenu()"]');
        if (menuButton) {
            menuButton.focus();
        }
    } else {
        // Open menu
        overlay.classList.add('active');
        menu.classList.add('active');
        menu.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        document.addEventListener('keydown', handleMenuKeyDown);
        document.addEventListener('click', handleOutsideClick);
        
        // Focus first menu item for accessibility
        const firstMenuItem = menu.querySelector('a');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }
}

// Handle keyboard navigation in mobile menu
function handleMenuKeyDown(e) {
    if (e.key === 'Escape') {
        toggleMobileMenu();
    }
    
    // Tab navigation within menu
    if (e.key === 'Tab') {
        const menu = document.getElementById('mobile-menu');
        const focusableElements = menu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
}

// Handle clicks outside mobile menu
function handleOutsideClick(e) {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (overlay && overlay.contains(e.target) && !menu.contains(e.target)) {
        toggleMobileMenu();
    }
}

// Enhanced rain animation - mobile optimized for performance
function initRainAnimation(containerId) {
    const rainContainer = document.getElementById(containerId);
    if (!rainContainer) return;
    
    // Clear existing raindrops
    rainContainer.innerHTML = '';
    
    // Check for reduced motion preference
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;
    
    // Mobile-optimized drop count
    const mobile = isMobile();
    const numberOfDrops = mobile ? 40 : 120; // Fewer drops on mobile
    const fragment = document.createDocumentFragment();
    
    // Use requestAnimationFrame for better performance
    let frameCount = 0;
    const createDropBatch = (batchSize) => {
        for (let i = 0; i < batchSize && frameCount < numberOfDrops; i++) {
            const rainDrop = document.createElement('div');
            rainDrop.className = 'rain-drop';
            
            // Random positioning and mobile-optimized timing
            rainDrop.style.left = `${Math.random() * 100}%`;
            const duration = mobile ? 4 + Math.random() * 2 : 2 + Math.random() * 2; // Slower on mobile
            rainDrop.style.animationDuration = `${duration}s`;
            rainDrop.style.animationDelay = `${Math.random() * 8}s`;
            
            // Add variety with different rain types
            const rainType = Math.random();
            if (rainType < 0.3) {
                rainDrop.classList.add('light');
            } else if (rainType > 0.8 && !mobile) { // No heavy rain on mobile
                rainDrop.classList.add('heavy');
            }
            
            // Occasionally add wind effect (less on mobile)
            if (Math.random() < (mobile ? 0.1 : 0.2)) {
                rainDrop.classList.add('windy');
            }
            
            fragment.appendChild(rainDrop);
            frameCount++;
        }
        
        if (frameCount < numberOfDrops) {
            requestAnimationFrame(() => createDropBatch(5));
        } else {
            rainContainer.appendChild(fragment);
        }
    };
    
    // Start creating drops in batches to prevent blocking
    createDropBatch(10);
}

// Enhanced about page rain animation - mobile optimized
function initAboutRainAnimation() {
    const rainContainer = document.getElementById('about-rain-container');
    if (!rainContainer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    rainContainer.innerHTML = '';
    
    const mobile = isMobile();
    const numberOfDrops = mobile ? 20 : 60; // Fewer drops on mobile
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 6}s`;
        drop.style.animationDuration = `${mobile ? 4 + Math.random() * 3 : 3 + Math.random() * 3}s`; // Slower on mobile
        drop.style.opacity = `${0.3 + Math.random() * 0.4}`;
        
        fragment.appendChild(drop);
    }
    
    rainContainer.appendChild(fragment);
}

// Enhanced reveal animations with Intersection Observer
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length === 0) return;
    
    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        revealElements.forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: isMobile() ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        observer.observe(el);
    });
}

// Enhanced calculator functionality with mobile improvements
function initCalculator() {
    const form = document.getElementById('calculator-form');
    
    if (!form) return;
    
    // Handle form submission with validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateCalculatorForm()) {
            calculateAdvancedRainwaterHarvesting();
        }
    });
    
    // Real-time validation with mobile-friendly debouncing
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        let timeout;
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            if (this.classList.contains('error')) {
                // Debounce validation on mobile
                timeout = setTimeout(() => {
                    validateField(this);
                }, isMobile() ? 300 : 100);
            }
        });
        
        // Mobile: Prevent zoom on number inputs
        if (input.type === 'number' && isMobile()) {
            input.addEventListener('focus', function() {
                this.setAttribute('inputmode', 'decimal');
            });
        }
    });
    
    // Add change event for select elements
    const selectElements = form.querySelectorAll('select');
    selectElements.forEach(select => {
        select.addEventListener('change', function() {
            validateField(this);
        });
    });
}

// Enhanced form validation with mobile-friendly messages
function validateCalculatorForm() {
    const form = document.getElementById('calculator-form');
    if (!form) return false;
    
    let isValid = true;
    const fields = [
        { id: 'city', message: 'Please enter a city name' },
        { id: 'roof-area', message: 'Please enter roof area (min 1 sq. meter)', min: 1 },
        { id: 'rooftop-type', message: 'Please select a rooftop type' },
        { id: 'people-count', message: 'Please enter number of people (min 1)', min: 1 },
        { id: 'tank-capacity', message: 'Please enter tank capacity (min 100 liters)', min: 100 }
    ];
    
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input) return;
        
        const value = input.value.trim();
        let fieldValid = true;
        
        if (!value) {
            fieldValid = false;
        } else if (field.min && parseFloat(value) < field.min) {
            fieldValid = false;
        }
        
        if (!fieldValid) {
            showFieldError(input, field.message);
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

// Field validation helper with mobile improvements
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    if (!value && field.required) {
        isValid = false;
        message = `${field.previousElementSibling.textContent.replace(/\s*\*?\s*$/, '')} is required`;
    } else if (field.type === 'number' && value) {
        const num = parseFloat(value);
        const min = parseFloat(field.min) || 0;
        const max = parseFloat(field.max) || Infinity;
        
        if (isNaN(num) || num < min || num > max) {
            isValid = false;
            message = `Please enter a valid number (${min}-${max === Infinity ? '∞' : max})`;
        }
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error with mobile-friendly styling
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message with mobile-friendly styling
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message text-red-500 text-sm mt-2 px-1';
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
    
    // Mobile: Scroll error into view
    if (isMobile()) {
        setTimeout(() => {
            errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Advanced calculator with mobile-optimized UX
function calculateAdvancedRainwaterHarvesting() {
    const form = document.getElementById('calculator-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const cityInput = document.getElementById('city');
    const roofAreaInput = document.getElementById('roof-area');
    const openAreaInput = document.getElementById('open-area');
    const rooftopTypeInput = document.getElementById('rooftop-type');
    const peopleCountInput = document.getElementById('people-count');
    const tankCapacityInput = document.getElementById('tank-capacity');
    
    if (!cityInput || !roofAreaInput || !rooftopTypeInput || !peopleCountInput || !tankCapacityInput) {
        showAlert('Calculator form elements not found. Please refresh the page.', 'error');
        return;
    }
    
    const city = cityInput.value.toLowerCase().trim();
    const roofArea = parseFloat(roofAreaInput.value);
    const openArea = parseFloat(openAreaInput.value) || 0;
    const rooftopType = rooftopTypeInput.value;
    const peopleCount = parseInt(peopleCountInput.value);
    const tankCapacity = parseFloat(tankCapacityInput.value);
    
    // Show loading state with mobile-friendly loading
    if (submitButton) {
        const originalContent = submitButton.innerHTML;
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Calculating...
        `;
        submitButton.disabled = true;
        
        // Mobile: Scroll to results section
        if (isMobile()) {
            const resultsContainer = document.getElementById('results-container');
            if (resultsContainer) {
                setTimeout(() => {
                    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }
        }
    }
    
    // Simulate calculation delay for better UX (shorter on mobile)
    const calculationDelay = isMobile() ? 800 : 1000;
    
    setTimeout(() => {
        try {
            // Get rainfall data with fuzzy matching
            let annualRainfall = findRainfallData(city);
            
            // Get runoff coefficient based on rooftop type
            const runoffCoeff = rooftopCoefficients[rooftopType] || 0.8;
            
            // Calculate collectible rainwater from roof (in liters)
            const roofWaterCollection = Math.round(roofArea * annualRainfall * runoffCoeff);
            
            // Calculate collectible rainwater from open area
            const openAreaWaterCollection = Math.round(openArea * annualRainfall * 0.4);
            
            // Total collectible water
            const totalCollectibleWater = roofWaterCollection + openAreaWaterCollection;
            
            // Calculate daily water need based on people count
            const dailyWaterNeed = peopleCount * dailyWaterConsumptionPerPerson;
            
            // Calculate cost savings (₹25 per 1000 liters)
            const costSavings = Math.round((totalCollectibleWater / 1000) * 25);
            
            // Calculate tank utilization percentage
            const utilizationPercent = Math.min(Math.round((totalCollectibleWater / tankCapacity) * 100), 100);
            
            // Calculate how many days the collected water can last
            const daysSupply = Math.round(totalCollectibleWater / dailyWaterNeed);
            
            // Update results with animation
            updateAdvancedResults({
                rainfall: annualRainfall,
                collectible: totalCollectibleWater,
                savings: costSavings,
                utilization: utilizationPercent,
                dailyNeed: dailyWaterNeed,
                daysSupply: daysSupply,
                rooftopType: rooftopType,
                runoffCoeff: runoffCoeff
            });
            
            // Show info message if using default rainfall
            if (!rainfallData[city]) {
                showAlert(`Using estimated rainfall data (${annualRainfall}mm) for ${city}. For more accurate results, try major city names.`, 'info');
            }
            
            // Show efficiency tips based on rooftop type
            showEfficiencyTips(rooftopType, utilizationPercent);
            
        } catch (error) {
            console.error('Calculation error:', error);
            showAlert('An error occurred during calculation. Please try again.', 'error');
        } finally {
            // Reset button
            if (submitButton) {
                submitButton.innerHTML = `
                    <span class="flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01m3-4h.01m-3 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Calculate Harvesting Potential
                    </span>
                `;
                submitButton.disabled = false;
            }
        }
    }, calculationDelay);
}

// Enhanced rainfall data matching
function findRainfallData(city) {
    // Direct match
    if (rainfallData[city]) {
        return rainfallData[city];
    }
    
    // Fuzzy matching
    const cityKeys = Object.keys(rainfallData);
    
    // Partial match
    let matchedCity = cityKeys.find(key => 
        key.includes(city) || city.includes(key)
    );
    
    if (matchedCity) {
        return rainfallData[matchedCity];
    }
    
    // Get regional rainfall default
    return getRegionalDefault(city);
}

// Get regional rainfall default
function getRegionalDefault(city) {
    const westernCities = ['mumbai', 'pune', 'ahmedabad', 'surat', 'rajkot'];
    const northernCities = ['delhi', 'jaipur', 'lucknow', 'kanpur', 'agra'];
    const southernCities = ['bangalore', 'chennai', 'hyderabad', 'kochi'];
    const easternCities = ['kolkata', 'bhubaneswar', 'guwahati'];
    
    if (westernCities.some(c => city.includes(c))) return 1000;
    if (northernCities.some(c => city.includes(c))) return 800;
    if (southernCities.some(c => city.includes(c))) return 1200;
    if (easternCities.some(c => city.includes(c))) return 1400;
    
    return 1000; // Default fallback
}

// Enhanced results update with mobile-optimized animations
function updateAdvancedResults(data) {
    const elements = {
        rainfall: document.getElementById('annual-rainfall'),
        collectible: document.getElementById('collectible-water'),
        savings: document.getElementById('cost-savings'),
        dailyNeed: document.getElementById('daily-need'),
        waterLevel: document.getElementById('water-level'),
        utilizationText: document.getElementById('utilization-percentage')
    };
    
    // Mobile-optimized animation durations
    const animationSpeed = isMobile() ? 0.8 : 1;
    
    // Animate number changes
    if (elements.rainfall) {
        animateValue(elements.rainfall, 0, data.rainfall, 1000 * animationSpeed, (val) => val.toLocaleString() + ' mm');
    }
    
    if (elements.collectible) {
        animateValue(elements.collectible, 0, data.collectible, 1500 * animationSpeed, (val) => val.toLocaleString() + ' liters');
    }
    
    if (elements.savings) {
        animateValue(elements.savings, 0, data.savings, 1200 * animationSpeed, (val) => '₹' + val.toLocaleString() + ' per year');
    }
    
    if (elements.dailyNeed) {
        animateValue(elements.dailyNeed, 0, data.dailyNeed, 1000 * animationSpeed, (val) => val.toLocaleString() + ' liters');
    }
    
    // Animate water level
    if (elements.waterLevel && elements.utilizationText) {
        setTimeout(() => {
            elements.waterLevel.style.height = data.utilization + '%';
            animateValue(elements.utilizationText, 0, data.utilization, 2000 * animationSpeed, (val) => val + '%');
            
            // Add visual feedback based on utilization
            const color = getUtilizationColor(data.utilization);
            elements.waterLevel.style.background = `linear-gradient(to top, ${color}, ${color}80)`;
            
            // Add utilization feedback
            showUtilizationFeedback(data.utilization, data.daysSupply);
        }, 500);
    }
}

// Get color based on utilization percentage
function getUtilizationColor(utilization) {
    if (utilization >= 80) return '#10B981'; // Green
    if (utilization >= 50) return '#F59E0B'; // Yellow
    if (utilization >= 25) return '#F97316'; // Orange
    return '#EF4444'; // Red
}

// Show utilization feedback with mobile-friendly messages
function showUtilizationFeedback(utilization, daysSupply) {
    let message = '';
    let type = 'info';
    
    if (utilization >= 100) {
        message = `Excellent! Your tank will be fully utilized. Water supply: ~${daysSupply} days.`;
        type = 'success';
    } else if (utilization >= 75) {
        message = `Great utilization! Water supply: ~${daysSupply} days. Consider a smaller tank.`;
        type = 'success';
    } else if (utilization >= 50) {
        message = `Good potential! Supply: ${daysSupply} days. Consider smaller tank or larger collection area.`;
        type = 'info';
    } else if (utilization >= 25) {
        message = `Moderate potential with ${daysSupply} days supply. Consider increasing roof area.`;
        type = 'warning';
    } else {
        message = `Low utilization: ${daysSupply} days supply. Consider a smaller tank or more collection area.`;
        type = 'warning';
    }
    
    setTimeout(() => showAlert(message, type), isMobile() ? 2000 : 2500);
}

// Show efficiency tips with mobile-friendly messages
function showEfficiencyTips(rooftopType, utilization) {
    const tips = {
        'metal': 'Metal roofs: excellent efficiency (95%)! Add gutters with filters for better quality.',
        'tile': 'Clay/concrete tiles: good collection (85%). Regular cleaning maintains efficiency.',
        'asphalt': 'Asphalt shingles: decent collection (75%). Consider more frequent filtering.',
        'flat-concrete': 'Flat concrete: good collection (80%). Ensure proper drainage slopes.',
        'green': 'Green roofs: lower collection (30%) but great for insulation and air quality.',
        'gravel': 'Gravel roofs: moderate collection (65%). Regular maintenance improves efficiency.'
    };
    
    const tip = tips[rooftopType];
    if (tip && utilization < 75) {
        setTimeout(() => showAlert(tip, 'info'), isMobile() ? 3500 : 4000);
    }
}

// Mobile-optimized value animation
function animateValue(element, start, end, duration, formatter) {
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (faster on mobile)
        const easeOutCubic = 1 - Math.pow(1 - progress, isMobile() ? 2.5 : 3);
        const currentValue = Math.round(start + (end - start) * easeOutCubic);
        
        element.textContent = formatter ? formatter(currentValue) : currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Enhanced contact form handling with mobile improvements
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateContactForm(this)) {
            return;
        }
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
        `;
        submitButton.disabled = true;
        
        // Simulate form submission (shorter delay on mobile)
        setTimeout(() => {
            const formData = new FormData(this);
            const name = formData.get('name');
            
            showAlert(`Thank you ${name}! Your message has been sent. We'll get back to you soon.`, 'success');
            this.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Mobile: Scroll to top
            if (isMobile()) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, isMobile() ? 1000 : 1500);
    });
    
    // Add real-time validation with mobile-friendly debouncing
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        let timeout;
        
        input.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            if (this.classList.contains('error')) {
                timeout = setTimeout(() => {
                    validateContactField(this);
                }, isMobile() ? 500 : 200);
            }
        });
    });
}

// Validate contact form
function validateContactForm(form) {
    const fields = form.querySelectorAll('[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateContactField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual contact field
function validateContactField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    if (!value) {
        isValid = false;
        message = `${field.previousElementSibling.textContent} is required`;
    } else if (field.type === 'email' && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (field.name === 'message' && value.length < 10) {
        isValid = false;
        message = 'Message should be at least 10 characters long';
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Mobile-optimized alert system
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alert = document.createElement('div');
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', 'polite');
    
    // Mobile-responsive positioning
    const baseClasses = 'custom-alert fixed z-50 p-4 rounded-lg shadow-lg transition-all duration-300';
    const mobileClasses = isMobile() ? 
        'top-4 left-4 right-4 transform -translate-y-full' : 
        'top-4 right-4 max-w-sm transform translate-x-full';
    
    alert.className = `${baseClasses} ${mobileClasses}`;
    
    // Set colors and icons based on type
    const alertConfig = {
        success: {
            classes: 'bg-green-500 text-white',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                   </svg>`
        },
        warning: {
            classes: 'bg-yellow-500 text-white',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                   </svg>`
        },
        error: {
            classes: 'bg-red-500 text-white',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                   </svg>`
        },
        info: {
            classes: 'bg-blue-500 text-white',
            icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                   </svg>`
        }
    };
    
    const config = alertConfig[type] || alertConfig.info;
    alert.className += ` ${config.classes}`;
    
    alert.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                ${config.icon}
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 flex-shrink-0 text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Animate in (different animations for mobile vs desktop)
    setTimeout(() => {
        if (isMobile()) {
            alert.style.transform = 'translateY(0)';
        } else {
            alert.style.transform = 'translateX(0)';
        }
    }, 100);
    
    // Auto remove (shorter timeout on mobile)
    const timeout = isMobile() ? 5000 : 7000;
    setTimeout(() => {
        if (alert.parentElement) {
            if (isMobile()) {
                alert.style.transform = 'translateY(-100%)';
            } else {
                alert.style.transform = 'translateX(100%)';
            }
            setTimeout(() => alert.remove(), 300);
        }
    }, timeout);
}

// Enhanced resize handler with debouncing and mobile optimization
function handleResize() {
    const mobile = isMobile();
    
    if (!mobile) {
        // Close mobile menu if window is resized to desktop
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');
        
        if (overlay && menu && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            menu.classList.remove('active');
            menu.style.transform = 'translateX(100%)';
            document.body.style.overflow = '';
        }
    }
    
    // Debounced rain animation reinitializtion
    clearTimeout(window.rainResizeTimeout);
    window.rainResizeTimeout = setTimeout(() => {
        initRainAnimation('rain-container');
        initAboutRainAnimation();
    }, mobile ? 200 : 100);
}

// Enhanced keyboard navigation with mobile support
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key functionality
        if (e.key === 'Escape') {
            // Close mobile menu
            const overlay = document.getElementById('mobile-menu-overlay');
            if (overlay && overlay.classList.contains('active')) {
                toggleMobileMenu();
                return;
            }
            
            // Close any open alerts
            const alerts = document.querySelectorAll('.custom-alert');
            alerts.forEach(alert => alert.remove());
        }
        
        // Enter key on calculator form
        if (e.key === 'Enter' && e.target.closest('#calculator-form')) {
            const form = document.getElementById('calculator-form');
            if (form && e.target.type !== 'submit' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                }
            }
        }
    });
    
    // Mobile: Add touch event handlers for better interaction
    if (isMobile()) {
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Prevent zoom on double tap for form elements
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    e.preventDefault();
                }
            }
            lastTouchEnd = now;
        }, false);
    }
}

// Page-specific initialization with mobile optimization
function initPageFeatures() {
    const currentPage = window.location.pathname;
    
    // Initialize common features
    initKeyboardNavigation();
    
    // Initialize based on page with mobile considerations
    if (currentPage.includes('home.html') || currentPage === '/' || currentPage === '') {
        // Home page
        initRainAnimation('rain-container');
    } else if (currentPage.includes('about.html')) {
        // About page
        initAboutRainAnimation();
        initRevealAnimations();
    } else if (currentPage.includes('calculate.html')) {
        // Calculator page
        initCalculator();
    } else if (currentPage.includes('contact.html')) {
        // Contact page
        initContactForm();
    }
    
    // Mobile-specific initialization
    if (isMobile()) {
        // Prevent iOS bounce scroll
        document.body.style.overscrollBehavior = 'none';
        
        // Optimize viewport for mobile
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Add mobile-specific classes
        document.body.classList.add('mobile');
        
        // Optimize animations for mobile performance
        if (window.DeviceMotionEvent) {
            // Reduce animations on older mobile devices
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (reducedMotion.matches) {
                document.body.classList.add('reduced-motion');
            }
        }
    }
}

// Debounce function with mobile optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring for mobile
function initPerformanceOptimizations() {
    // Monitor performance on mobile
    if (isMobile() && 'performance' in window) {
        // Reduce animation complexity on slower devices
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation && navigation.loadEventEnd > 3000) { // Slow loading
            document.body.classList.add('performance-mode');
            // Reduce rain drops further
            const rainDrops = document.querySelectorAll('.rain-drop, .raindrop');
            rainDrops.forEach((drop, index) => {
                if (index % 3 !== 0) { // Keep only every 3rd drop
                    drop.style.display = 'none';
                }
            });
        }
    }
    
    // Optimize images for mobile
    if (isMobile()) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }
}

// Service worker registration for mobile performance
function initServiceWorker() {
    if ('serviceWorker' in navigator && isMobile()) {
        window.addEventListener('load', function() {
            // Register service worker for caching (implementation would go in separate file)
            // This is just the registration placeholder
            console.log('Service Worker support detected');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize page-specific features
        initPageFeatures();
        
        // Initialize performance optimizations
        initPerformanceOptimizations();
        
        // Initialize service worker for mobile
        initServiceWorker();
        
        // Add event listeners with performance optimization
        const debouncedResize = debounce(handleResize, isMobile() ? 300 : 250);
        window.addEventListener('resize', debouncedResize);
        
        // Add orientation change handler for mobile
        if (isMobile()) {
            window.addEventListener('orientationchange', function() {
                setTimeout(() => {
                    handleResize();
                    // Fix viewport issues on orientation change
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                }, 100);
            });
            
            // Set initial viewport height for mobile
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        // Add passive event listeners for better mobile performance
        if (isMobile()) {
            document.addEventListener('scroll', function() {
                // Handle scroll events (placeholder for scroll-based animations)
            }, { passive: true });
            
            document.addEventListener('touchmove', function(e) {
                // Prevent overscroll on certain elements
                if (e.target.closest('.mobile-menu')) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
        
        console.log('RainVault website initialized successfully', isMobile() ? '(Mobile Mode)' : '(Desktop Mode)');
        
    } catch (error) {
        console.error('Initialization error:', error);
        // Fallback initialization
        if (isMobile()) {
            document.body.classList.add('fallback-mode');
        }
    }
});

// Handle page visibility changes for mobile battery optimization
document.addEventListener('visibilitychange', function() {
    if (isMobile()) {
        const rainContainers = document.querySelectorAll('.rain-container');
        const animations = document.querySelectorAll('[class*="animate"]');
        
        if (document.hidden) {
            // Pause animations when page is not visible
            animations.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            // Resume animations when page becomes visible
            animations.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    }
});

// Handle network changes on mobile
if ('connection' in navigator && isMobile()) {
    navigator.connection.addEventListener('change', function() {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Disable animations on very slow connections
            document.body.classList.add('slow-connection');
        } else {
            document.body.classList.remove('slow-connection');
        }
    });
}

// Export functions for global access with mobile context
window.RainVault = {
    toggleMobileMenu,
    calculateAdvancedRainwaterHarvesting,
    showAlert,
    isMobile: isMobile()
};
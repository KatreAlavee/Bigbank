
beforeEach(() => {
    cy.visit('https://laenutaotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS')
  })
// Function to enter a loan amount
const enterLoanAmount = (amount) => {
    cy.get('input[name="header-calculator-amount"]')
      .clear()
      .type(amount)
      .should('have.value', amount);
  };
  
  // Function to enter a loan period
  const enterLoanPeriod = (period) => {
    cy.get('input[name="header-calculator-period"]')
      .clear()
      .type(period)
      .should('have.value', period);
  };
  
  // Function to click on the "JÄTKA" button
  const clickJatkaButton = () => {
    cy.contains('.bb-button__label', 'JÄTKA').click();
  };
  
  // Function to open the modal
  const openModal = () => {
    cy.get('.bb-edit-amount__amount').click();
  };

// Function to move loan amount slider
const moveLoanAmountSlider = (distance) => {
  cy.get('.vue-slider-dot-handle').eq(0).trigger('mousedown', { which: 1, pageX: 0, pageY: 0 })
      .trigger('mousemove', { clientX: distance, clientY: 0 })
      .trigger('mouseup', { force: true });
};

// Function to move loan period slider
const moveLoanPeriodSlider = (distance) => {
  cy.get('.vue-slider-dot-handle').eq(1).trigger('mousedown', { which: 1, pageX: 0, pageY: 0 })
      .trigger('mousemove', { clientX: distance, clientY: 0 })
      .trigger('mouseup', { force: true });
};


  describe('Functional test for choosing the loan amount and period', () => {

    it('should move loan amount and loan period sliders', () => {
      // Move loan amount slider to the left by 100 pixels
      moveLoanAmountSlider(-100);
  
      // Move loan period slider to the right by 100 pixels
      moveLoanPeriodSlider(100);

      /*it didn't move sliders as I expected
      I tryed multiple versions
      I left the code here for feedback, why it didn't move */
  });
    

    it('Calculator changes should be saved after clicking the button "jätka"', () => {
      // Wait for the input field to be available in the DOM
      cy.get('input[name="header-calculator-amount"]').should('exist').then(() => {
        // Enter loan amount
        enterLoanAmount('6000');
        enterLoanPeriod('7');
        clickJatkaButton();
              // Assert that modal has previously inserted values
      cy.get('input[name="header-calculator-amount"]')
      .invoke('val')
      .then(value => {
        const normalizedValue = value.replace(/\s/g, '');
        expect(normalizedValue).to.equal('6000');
         });
    cy.get('input[name="header-calculator-period"]').should('have.value', '7');
      });
    });

    it('Calculator values should be automatically corrected when entering out of range values', () => {
        // User can add an invalid integer to the loan amount
        enterLoanAmount('31000');
    
        // In order to activate calculation/correction, user has to click somewhere outside the input field
        cy.get('.bb-modal__body').click();
    
        // Checking if the value is automatically corrected
        cy.get('input[name="header-calculator-amount"]')
            .invoke('val')
            .then(value => {
                const normalizedValue = value.replace(/\s/g, '');
                expect(normalizedValue).to.equal('30000');
            });
    
        // User can add an invalid integer to the loan period
        enterLoanPeriod('5');
    
        // In order to activate calculation/correction, user has to click somewhere outside the input field
        cy.get('.bb-modal__body').click();
    
        // Checking if the value is automatically corrected to the minimum period
        cy.get('input[name="header-calculator-period"]').should('have.value', '6');
    
        // User can click on the button "jätka"
        clickJatkaButton();
    
        // Selected amount and period are saved
        cy.get('.bb-edit-amount__amount').should('contain', '30000 €');
    
        // Opening modal
        openModal();
    
        // Assert that modal has previously inserted values
        cy.get('input[name="header-calculator-amount"]')
            .invoke('val')
            .then(value => {
                const normalizedValue = value.replace(/\s/g, '');
                expect(normalizedValue).to.equal('30000');
            });
        cy.get('input[name="header-calculator-period"]').should('have.value', '6');
    });
    
    it('Calculator changes should not be saved after clicking the "x" button', () => {
        //User can add valid integer to the loan amount
        enterLoanAmount('20000');
    
        //User can add valid integer to the loan period
        enterLoanPeriod('115');
    
        //User can click on the button "x"
        cy.get('.svg2492519115__a.bb-icon__dynamic-fill').click();
    
        //Selected amount and period are not saved
        cy.get('.bb-edit-amount__amount').should('not.contain', '20000');
    
        //Opening modal and verifying that previously added amount and period are not saved
        openModal();
        cy.get('input[name="header-calculator-amount"]').should('not.contain', '20000');
        cy.get('input[name="header-calculator-period"]').should('not.contain', '115');
    });
    
    it('Calculator changes should not be saved when modal closes after clicking outside the modal', () => {
        //User can add valid integer to the loan amount
        enterLoanAmount('4000');
    
        //User can add valid integer to the loan period
        enterLoanPeriod('100');
    
        // Click outside the modal (on the overlay)
        cy.get('.bb-overlay').click({ force: true });
    
        //Selected amount and period are not saved
        cy.get('.bb-edit-amount__amount').should('not.contain', '4000');
    
        //Opening modal and verifying that previously added amount and period are not saved
        openModal();
        cy.get('input[name="header-calculator-amount"]').should('not.contain', '4000');
        cy.get('input[name="header-calculator-period"]').should('not.contain', '100');
    });




    describe('Loan Calculator Test', () => {
        it('Should update monthly payment when amount and period are changed', () => {
            // Set initial values for the loan amount and period
            const initialAmount = 5000;
            const initialPeriod = 60;
        
            // Set new values for the loan amount and period
            const newAmount = 15000;
            const newPeriod = 24;
        
            // Enter initial loan amount and period
            enterLoanAmount(initialAmount);
            enterLoanPeriod(initialPeriod);
        
            // Click somewhere outside the input fields to activate calculation/correction
            cy.get('.bb-modal__body').click();
        
            // Capture the initial monthly payment value
            cy.get('.bb-labeled-value__value').then(($monthlyPayment) => {
                const initialMonthlyPayment = parseFloat($monthlyPayment.text().replace('€', '119.43'));
        
                // Change the loan amount and period
                enterLoanAmount(newAmount);
                enterLoanPeriod(newPeriod);
        
                // Click somewhere outside the input fields to activate calculation/correction
                cy.get('.bb-modal__body').click();
        
                // Capture the updated monthly payment value
                cy.get('.bb-labeled-value__value').then(($updatedMonthlyPayment) => {
                    const updatedMonthlyPayment = parseFloat($updatedMonthlyPayment.text().replace('€', '723.83'));
        
                    // Assert that the updated monthly payment value is different from the initial one
                    expect(updatedMonthlyPayment).not.to.equal(initialMonthlyPayment);
                });
            });
        });
    });
  
    
    

  });
  
  

  






  
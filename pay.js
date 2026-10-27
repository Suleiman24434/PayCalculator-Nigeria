document.getElementById('salaryForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values
    const basic = parseFloat(document.getElementById('basicSalary').value) || 0;
    const housing = parseFloat(document.getElementById('housing').value) || 0;
    const transport = parseFloat(document.getElementById('transport').value) || 0;

    // Calculate Gross Income
    const grossIncome = basic + housing + transport;

    // Standard Pension contribution (8% of Basic + Housing + Transport usually, or Basic. Let's use 8% of Gross for simplicity)
    const pension = grossIncome * 0.08;

    // Simplified progressive tax approximation (PAYE) based on annual taxable income brackets
    // Annual Gross minus pension and consolidated relief allowance approximation
    const annualGross = grossIncome * 12;
    const annualPension = pension * 12;
    const consolidatedRelief = Math.max(200000, annualGross * 0.01) + (annualGross * 0.20);
    let annualTaxable = annualGross - annualPension - consolidatedRelief;
    if (annualTaxable < 0) annualTaxable = 0;

    let annualTax = 0;
    // Simple Nigerian tax bands approximation
    if (annualTaxable <= 300000) {
        annualTax = annualTaxable * 0.07;
    } else if (annualTaxable <= 600000) {
        annualTax = (300000 * 0.07) + ((annualTaxable - 300000) * 0.11);
    } else if (annualTaxable <= 1100000) {
        annualTax = (300000 * 0.07) + (300000 * 0.11) + ((annualTaxable - 600000) * 0.15);
    } else {
        annualTax = (300000 * 0.07) + (300000 * 0.11) + (500000 * 0.15) + ((annualTaxable - 1100000) * 0.19);
    }

    const monthlyTax = annualTax / 12;
    const netPay = grossIncome - pension - monthlyTax;

    // Format currency function (Naira)
    const formatNaira = (amount) => {
        return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Update DOM elements
    document.getElementById('resGross').textContent = formatNaira(grossIncome);
    document.getElementById('resPension').textContent = '-' + formatNaira(pension);
    document.getElementById('resTax').textContent = '-' + formatNaira(monthlyTax);
    document.getElementById('resNet').textContent = formatNaira(netPay);
});

// Copy Summary Button functionality
document.getElementById('copyBtn').addEventListener('click', function() {
    const gross = document.getElementById('resGross').textContent;
    const pension = document.getElementById('resPension').textContent;
    const tax = document.getElementById('resTax').textContent;
    const net = document.getElementById('resNet').textContent;

    const summaryText = `Salary Breakdown:\nGross: ${gross}\nPension: ${pension}\nTax (PAYE): ${tax}\nNet Pay: ${net}`;
    
    navigator.clipboard.writeText(summaryText).then(() => {
        alert('Salary summary copied to clipboard!');
    });
});
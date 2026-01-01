import fs from 'fs';
import path from 'path';

export const EmailTemplate = {
    /**
     * Reads a template HTML file from the 'html' directory and replaces placeholders.
     * @param templateName The filename of the template (e.g., 'order-confirmed.html')
     * @param replacements A key-value map of placeholders to replace (e.g., { '{{orderId}}': '123' })
     * @returns The processed HTML string
     */
    getTemplate: (templateName: string, replacements: Record<string, string>): string => {
        try {
            const templatePath = path.join(process.cwd(), 'src', 'email', templateName);
            let htmlContent = fs.readFileSync(templatePath, 'utf8');

            for (const [key, value] of Object.entries(replacements)) {
                // Replace all occurrences
                htmlContent = htmlContent.split(key).join(value);
            }

            return htmlContent;
        } catch (error) {
            console.error(`Error loading email template ${templateName}:`, error);
            return `<h1>Error loading template: ${templateName}</h1>`; // Fallback
        }
    }
};

/**
 * Helper to generate the HTML row for a single order item.
 * matches the design in html/order-confirmed.html
 */
export const generateOrderItemRow = (name: string, details: string, price: string): string => {
    return `
    <tr>
        <td class="product-cell" width="80%">
            <span class="product-name">${name}</span>
            <span class="product-detail">${details}</span>
        </td>
        <td class="price-cell" width="20%">${price}</td>
    </tr>`;
};

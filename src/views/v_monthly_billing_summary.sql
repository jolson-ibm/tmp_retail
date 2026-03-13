-- View: v_monthly_billing_summary
-- Description: Monthly billing summary from sales invoices with totals, counts, and averages.
-- Source: retail2.sales_invoices_oinv
-- Issue: #6

CREATE OR REPLACE VIEW retail2.v_monthly_billing_summary AS
SELECT 
    SUBSTR(doc_date, 1, 7) AS billing_month,
    ROUND(SUM(doc_total), 2) AS total_billing,
    COUNT(*) AS invoice_count,
    ROUND(AVG(doc_total), 2) AS avg_invoice_amount
FROM retail2.sales_invoices_oinv
GROUP BY SUBSTR(doc_date, 1, 7)
ORDER BY billing_month;

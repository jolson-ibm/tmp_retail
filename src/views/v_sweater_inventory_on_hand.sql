CREATE OR REPLACE VIEW retail2.v_sweater_inventory_on_hand AS
SELECT 
    item_code,
    item_name,
    SUM(on_hand) as total_on_hand
FROM 
    retail2.master_articles_oitm
WHERE 
    item_name LIKE '%MER-SFC SC 66000 16 SWEATER%'
GROUP BY 
    item_code,
    item_name
HAVING 
    SUM(on_hand) > 0
ORDER BY 
    item_name, item_code;
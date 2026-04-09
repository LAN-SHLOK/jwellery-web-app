
CREATE OR REPLACE FUNCTION decrement_stock_batch(items jsonb)
RETURNS void AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN SELECT * FROM jsonb_to_recordset(items) AS x(id uuid, quantity int) LOOP
    UPDATE products
    SET stock_quantity = stock_quantity - item.quantity
    WHERE id = item.id AND stock_quantity >= item.quantity;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock or product not found for ID %', item.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

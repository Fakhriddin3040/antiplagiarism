SELECT f.id as f_id, da.id as d_id
FROM folders AS f
         INNER JOIN users AS u
                    ON u.id = f.created_by_id
        INNER JOIN documents_authors AS da
                    ON u.id = da.created_by_id;

SELECT COUNT(*) from document_chunks;

DELETE ;FROM files;
DELETE FROM documents_authors;
DELETE FROM folders where id = 'fde6f226-fd70-4c3c-a1d6-4dfdfbd0e291';

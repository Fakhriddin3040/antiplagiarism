-- SELECT f.id as f_id, da.id as d_id
-- FROM folders AS f
--          INNER JOIN users AS u
--                     ON u.id = f.created_by_id
--         INNER JOIN documents_authors AS da
--                     ON u.id = da.created_by_id;
--
-- SELECT * from document_chunks;
--
-- SELECT ch.content, 1 - (ch.vector <=> '[482535196.00000000, 1121860881.00000000, 414071843.00000000, 92642335.00000000, 14425394.00000000, 153938619.00000000, 181820045.00000000, 89455600.00000000, 381379774.00000000, 609336245.00000000, 45234442.00000000, 1681803.00000000, 141915544.00000000, 213082323.00000000, 46470978.00000000, 27138911.00000000, 225897068.00000000, 367826633.00000000, 170714761.00000000, 651287075.00000000, 154325300.00000000, 64795815.00000000, 25166646.00000000, 5254191.00000000, 75788153.00000000, 154628309.00000000, 405914724.00000000, 1120441054.00000000, 33673593.00000000, 285159517.00000000, 260234893.00000000, 189552698.00000000, 254921875.00000000, 12052573.00000000, 39647149.00000000, 349909861.00000000, 260705356.00000000, 296905127.00000000, 678247228.00000000, 45384705.00000000, 102146332.00000000, 660091539.00000000, 174802720.00000000, 257694683.00000000, 117034830.00000000, 742903.00000000, 311853763.00000000, 182054926.00000000, 416371420.00000000, 670856531.00000000, 724241482.00000000, 523844683.00000000, 286910405.00000000, 104813857.00000000, 299875706.00000000, 658894742.00000000, 246922057.00000000, 393160745.00000000, 306004016.00000000, 87239342.00000000, 324786891.00000000, 503805131.00000000, 367866359.00000000, 259644088.00000000, 231089304.00000000, 54126005.00000000, 668760387.00000000, 921770.00000000, 487144265.00000000, 731474111.00000000, 492413271.00000000, 198485483.00000000, 509749674.00000000, 227736863.00000000, 744497909.00000000, 219167040.00000000, 331853327.00000000, 186224166.00000000, 92671070.00000000, 123008834.00000000, 937722753.00000000, 490744951.00000000, 739407453.00000000, 127796988.00000000, 100004635.00000000, 957637636.00000000, 26394434.00000000, 545104527.00000000, 105667181.00000000, 181692308.00000000, 196392787.00000000, 1222834.00000000, 410352965.00000000, 337540556.00000000, 43458975.00000000, 213689539.00000000, 34861740.00000000, 95165166.00000000, 656226534.00000000, 356984803.00000000, 69973182.00000000, 5444030.00000000, 228725578.00000000, 9723976.00000000, 615358121.00000000, 518246224.00000000, 87444594.00000000, 922748462.00000000, 190659901.00000000, 393186359.00000000, 134882573.00000000, 225481403.00000000, 37313124.00000000, 87421480.00000000, 302733260.00000000, 2549614.00000000, 73792978.00000000, 707253162.00000000, 423533127.00000000, 244889592.00000000, 315706436.00000000, 235836556.00000000, 929569354.00000000, 507186239.00000000, 116518794.00000000, 601266403.00000000, 10147288.00000000, 190132940.00000000]') AS sim_score FROM document_chunks as ch ORDER BY sim_score DESC LIMIT 5;
--
--
-- select * from files

SELECT
    self.idx            AS from_idx,
    self.content        AS from_content,
    self.document_id    AS from_document,

    other.idx           AS to_idx,
    other.content       AS to_content,
    other.document_id   AS other_document,

    1 - (self.vector <=> other.vector) AS similarity

FROM document_chunks AS self

         JOIN LATERAL (
    SELECT *
    FROM document_chunks AS other
    WHERE other.document_id != '98c68a9d-0f90-4ac9-bee4-5a930f49ce64'
      AND other.size >= 50
      AND self.vector <=> other.vector < 0.25
    ORDER BY self.vector <=> other.vecto
    LIMIT 5
    ) AS other ON TRUE

WHERE self.document_id = '98c68a9d-0f90-4ac9-bee4-5a930f49ce64'
  AND self.size >= 50

-- финальная чистка (можно оставить для последующей фильтрации)
-- можно обернуть во VIEW или сделать WHERE similarity >= 0.78
ORDER BY similarity DESC;


SELECT COUNT(*) FROM document_chunks;


SELECT self.idx                           AS from_idx,
       self.content                       AS from_content,
       self.document_id                   AS from_document,

       other.idx                          AS to_idx,
       other.content                      AS to_content,
       other.document_id                  AS other_document,
       1 - (self.vector <=> other.vector) AS similarity
FROM document_chunks AS self
         JOIN LATERAL (
    SELECT *
    FROM document_chunks AS other
    WHERE document_id != '98c68a9d-0f90-4ac9-bee4-5a930f49ce64'
    ORDER BY self.vector <=> other.vector
    ) AS other ON TRUE
WHERE self.document_id = '98c68a9d-0f90-4ac9-bee4-5a930f49ce64'  order by similarity DESC

SELECT * FROM documents;


SELECT dc.*,
       1 - (src.vector <=> dc.vector) AS sim
FROM   document_chunks AS src
           JOIN   LATERAL (
    SELECT c.id, c.vector
    FROM   document_chunks AS c
    WHERE  c.document_id <> :doc_id
    ORDER  BY src.vector <=> c.vector
    LIMIT  :top_k
    ) AS dc ON TRUE
WHERE  src.document_id = :doc_id
  AND  1 - (src.vector <=> dc.vector) >= :thr;


SELECT src.*,
       json_agg(
               json_build_object(
                       'chunk',     to_jsonb(dc.*),
                       'similarity', 1 - (src.vector <=> dc.vector)
               )
       ) AS candidates
FROM   document_chunks AS src
           JOIN   LATERAL (
    SELECT c.*
    FROM   document_chunks AS c
    WHERE  c.document_id <> :doc_id
    ORDER  BY src.vector <=> c.vector
    LIMIT  :top_k
    ) AS dc ON TRUE
WHERE  src.document_id = :doc_id
  AND  1 - (src.vector <=> dc.vector) >= :thr
GROUP  BY src.id;



SELECT p.*, sd.content as source_content, td.content as target_content FROM plagiarism_matches as p
inner join document_chunks AS sd
on p.source_chunk_id = sd.id
inner join document_chunks AS td
ON p.matched_chunk_id = td.id where similarity = 1;


SELECT count(*) from document_chunks where document_id = '39988c40-1981-46f1-ac4d-14d86453797d';

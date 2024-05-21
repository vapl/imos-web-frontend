DECLARE @atgr_koef DECIMAL(10,2) = 1,
		@darbs_zagis DECIMAL(10,2) = 0.72,
		@darbs_abs_mala DECIMAL(10,2) = 2.33,
		@darbs_pak DECIMAL(10,2) = 2.76,
		@darbs_nol DECIMAL(10,2) = 3.56,
		@darbs_cnc DECIMAL(10,2) = 4.20,
		@darbs_konstr DECIMAL(10,2) = 6.72,
		@darbs_sal DECIMAL(10,2) = 6.28,
		@mat_uzcenojums DECIMAL(10,2) = 1.10,
		@pard_uzcenojums DECIMAL(10,2) = 1.955,
		@mdf_painted DECIMAL(10,2) = 52.00,
		@mdf_painted_polished DECIMAL(10,2) = 75.00

SELECT DISTINCT
	mat.BESTELLUNG AS CODE_ID,
	REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    LEFT(mat.NAME, CHARINDEX(' ', mat.NAME + ' ') - 1),
    'EG_', ''), 'KS_', ''), 'PD_', ''), 'KR_', ''), 'RH_', ''), 'SH_', ''),
    '_' + REPLACE(CONVERT(VARCHAR(20), REPLACE(mat.THK, '.', '_')), 'mm', ''), ''), '_', ' ') AS CODE,

	UPPER(SUBSTRING(REPLACE(REPLACE(REPLACE(LEFT(mat.ORDERID, CHARINDEX(' ', mat.ORDERID + ' ') - 1), '_' + CONVERT(VARCHAR(20), REPLACE(mat.THK, '.', '_')), ''), 'mm', ''), '_', ' '), 1, 1)) +
    LOWER(SUBSTRING(REPLACE(REPLACE(REPLACE(LEFT(mat.ORDERID, CHARINDEX(' ', mat.ORDERID + ' ') - 1), '_' + CONVERT(VARCHAR(20), REPLACE(mat.THK, '.', '_')), ''), 'mm', ''), '_', ' ')
    , 2, LEN(REPLACE(REPLACE(REPLACE(LEFT(mat.ORDERID, CHARINDEX(' ', mat.ORDERID + ' ') - 1), '_' + CONVERT(VARCHAR(20), REPLACE(mat.THK, '.', '_')), ''), 'mm', ''), '_', ' ')))) AS NAME, 
	CASE WHEN mat.THK LIKE '%.%' THEN FORMAT(mat.THK, '0.0') ELSE FORMAT(mat.THK, '0') END AS THK,
	mat.GRAIN,
	LEFT((SELECT sub_mf.NAME AS MAT_GROUP FROM iX_1033.dbo.MATFOLDER sub_mf WHERE sub_mf.DIR_ID = mf.PARENT_ID), 1) AS PRICE_GROUP,
	--mat.COMMENT, 
	FORMAT((((((mat.COST +
		CASE
			WHEN r.SCOST IS NOT NULL THEN r.SCOST
			ELSE 0
		END
		) * @atgr_koef) + 
		CASE 
			WHEN prf.COST IS NOT NULL THEN
				CASE	
					WHEN mat.THK < 23 THEN prf.COST * 4.4
					WHEN mat.THK > 23 AND mat.THK < 28 THEN prf.COST * 4.4
					WHEN mat.THK > 28 AND mat.THK < 43 THEN prf.COST * 4.4
				END
			ELSE 0
		END) * 
		@mat_uzcenojums) + (@darbs_zagis + @darbs_abs_mala + @darbs_pak + @darbs_nol)) * @pard_uzcenojums, '0.00') AS COST,
	FORMAT((((((mat.COST +
		CASE
			WHEN r.SCOST IS NOT NULL THEN r.SCOST
			ELSE 0
		END
		) * @atgr_koef) + 
		CASE 
			WHEN prf.COST IS NOT NULL THEN
				CASE	
					WHEN mat.THK < 23 THEN prf.COST * 4.4
					WHEN mat.THK > 23 AND mat.THK < 28 THEN prf.COST * 4.4
					WHEN mat.THK > 28 AND mat.THK < 43 THEN prf.COST * 4.4
				END
			ELSE 0
		END) * 
		@mat_uzcenojums) + (@darbs_zagis + @darbs_abs_mala + @darbs_pak + @darbs_nol + 
		CASE
			WHEN mat.THK NOT LIKE 3 THEN
				@darbs_cnc + @darbs_sal + @darbs_konstr
			ELSE 0
			END)) * @pard_uzcenojums, '0.00') AS COST2,

	CASE WHEN cms.L IS NULL AND cms.B IS NULL THEN NULL ELSE CONCAT(cms.L-20, ' X ', cms.B-20) END AS SHEET_DIM,
	CASE 
		WHEN SUBSTRING(mat.RENDER_PRZ, 3, 1) = '_' OR SUBSTRING(mat.RENDER_PRZ, 2, 1) = '_' THEN
			SUBSTRING(
				CASE 
					WHEN mat.RENDER_PRZ LIKE '%ST38%' THEN REPLACE(mat.RENDER_PRZ, 'ST', '')
					ELSE mat.RENDER_PRZ
				END,
				4,
				CASE 
					WHEN mat.RENDER_PRZ LIKE '%ST38%' THEN LEN(REPLACE(mat.RENDER_PRZ, 'ST', '')) - 3
					WHEN CHARINDEX('_ST', mat.RENDER_PRZ) > 0 THEN CHARINDEX('_ST', mat.RENDER_PRZ) - 4
					WHEN CHARINDEX('_HG', mat.RENDER_PRZ) > 0 THEN CHARINDEX('_HG', mat.RENDER_PRZ) - 4
					WHEN CHARINDEX('_SM', mat.RENDER_PRZ) > 0 THEN CHARINDEX('_SM', mat.RENDER_PRZ) - 4
					WHEN CHARINDEX('_VNR', mat.RENDER_PRZ) > 0 THEN CHARINDEX('_VNR', mat.RENDER_PRZ) - 4
					WHEN CHARINDEX('_LN', mat.RENDER_PRZ) > 0 THEN CHARINDEX('_LN', mat.RENDER_PRZ) - 4
					ELSE LEN(mat.RENDER_PRZ) -3
				END
			)
		ELSE mat.RENDER_PRZ 
	END + '.jpg' AS TEXTURE
		--prf.COST,
		--r.SCOST,
		--mat.RENDER_PRZ
FROM [iX_1033].[dbo].[MAT] mat
LEFT JOIN iX_1033.dbo.CMSRAWMAT cms ON cms.MATID = mat.NAME
LEFT JOIN iX_1033.dbo.PROFIL prf ON mat.RENDER_PRZ = prf.RENDER_PRZ 
	AND prf.PRFDE IN (0.8, 1)
	AND prf.THK = 
		CASE
			WHEN mat.THK < 23 THEN 23
			WHEN mat.THK > 23 AND mat.THK < 28 THEN 28
			WHEN mat.THK > 28 AND mat.THK < 43 THEN 43
			ELSE prf.THK
		END
LEFT JOIN iX_1033.dbo.RENDERMATERIAL rm ON rm.TEXTURE = mat.RENDER_PRZ
JOIN iX_1033.dbo.MATFOLDER mf ON mat.NAME = mf.NAME
LEFT JOIN iX_1033.dbo.RENDER r ON prf.RENDER_PRZ LIKE r.NAME
WHERE mat.MATCAT IN ('LAMINATS', 'AKRILS', 'ARPAKALPOJUMS', 'MDF', 'HDF', 'FINIEREJUMS')
	AND mat.COMMENT NOT IN ('Out of stock', '') AND mat.NAME NOT LIKE '%HDF%' --AND mat.THK = 3
ORDER BY PRICE_GROUP ASC;


--SELECT *
--FROM iX_1033.dbo.CMSRAWMAT;

--SELECT SUBSTRING(RENDER_PRZ, 3, 1), RENDER_PRZ
--FROM iX_1033.dbo.MAT;

--SELECT NAME, RENDER_PRZ
--FROM iX_1033.dbo.PROFIL;

--SELECT *
--FROM iX_1033.dbo.RENDERMATERIAL
--WHERE NAME LIKE '%RAL%';

--SELECT * FROM
--iX_1033.dbo.r_MatTable;

--SELECT *
--FROM iX_1033.dbo.MATFOLDER
--WHERE NAME LIKE '%%';

--SELECT *
--FROM iX_1033.dbo.RENDER
--WHERE NAME LIKE '%RAL%';
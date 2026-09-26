SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;

-- ==========================================================
-- BloodConnectHub Database Seed Data Script (SQL Server Version)
-- Generated on: 2026-06-30T16:29:33.930Z
-- ==========================================================

-- Disable Constraints and Delete existing data in reverse order
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";

PRINT 'Deleting existing records...';
DELETE FROM [Notifications];
DELETE FROM [DonationLabReports];
DELETE FROM [DonorMedicalDocuments];
DELETE FROM [BloodDisbursements];
DELETE FROM [BloodInventoryItems];
DELETE FROM [DonorRequestResponses];
DELETE FROM [Donations];
DELETE FROM [BloodRequests];
DELETE FROM [Patients];
DELETE FROM [Donors];

PRINT 'Inserting Donors...';
SET IDENTITY_INSERT [Donors] ON;
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (1, N'جمال الرياني', '144859287646', 2, '1985-11-02 18:09:30', '0915302013', 3, N'الزاوية', 1, 3, '2025-08-07 23:16:31');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (2, N'مريم الشركسي', '156709818016', 2, '2001-12-01 11:01:35', '0916950603', 3, N'طبرق', 0, 3, '2025-07-31 06:46:20');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (3, N'سالم الشارف', '147798859137', 2, '1982-01-26 02:48:18', '0914119279', 1, N'غريان', 1, 3, '2025-07-17 17:17:51');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (4, N'ابتسام المصراتي', '198099979400', 2, '1995-12-31 12:35:54', '0922614696', 8, N'غريان', 1, 3, '2025-08-11 18:50:19');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (5, N'فاطمة الغراري', '185059693961', 2, '1976-02-13 00:06:46', '0923579785', 4, N'سرت', 0, 3, '2025-08-15 04:49:28');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (6, N'أسماء الفيتوري', '165833590889', 2, '1985-12-24 22:18:52', '0911985531', 1, N'سرت', 1, 3, '2025-08-22 04:12:07');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (7, N'مصطفى الفيتوري', '145961822212', 1, '1993-08-08 08:40:39', '0925313528', 6, N'سرت', 1, 3, '2025-08-26 21:07:58');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (8, N'علي عمار', '149032691490', 1, '1975-11-14 10:13:51', '0914905138', 3, N'غريان', 1, 3, '2025-08-07 13:19:45');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (9, N'محمد الرياني', '156895402327', 1, '1984-03-11 00:17:53', '0916302394', 6, N'سرت', 1, 1, '2025-07-01 04:11:35');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (10, N'عبد الله الرياني', '144084565044', 1, '1976-03-10 09:45:23', '0927908119', 7, N'ترهونة', 1, 3, '2025-07-07 15:26:29');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (11, N'سارة شرف الدين', '113113740468', 2, '1988-08-03 20:40:09', '0925324237', 3, N'طرابلس', 1, 3, '2025-07-18 05:25:02');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (12, N'حنان الغراري', '187924933685', 2, '1987-08-10 09:14:21', '0912396683', 2, N'بنغازي', 1, 1, '2025-07-22 07:33:59');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (13, N'محمود الصادق', '125517347130', 1, '2001-09-28 07:50:04', '0912397558', 7, N'الخمس', 1, 3, '2025-08-31 07:48:18');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (14, N'أميرة البوسيفي', '177673728289', 2, '1995-05-23 09:22:50', '0924424536', 5, N'الزاوية', 1, 1, '2025-08-08 04:57:58');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (15, N'هدى الغراري', '134228620705', 2, '1986-08-23 20:37:12', '0922466890', 1, N'الخمس', 1, 3, '2025-08-01 11:01:01');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (16, N'نور الزوي', '118944482853', 2, '1987-06-24 10:10:49', '0922181437', 6, N'سبها', 1, 3, '2025-07-20 22:14:17');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (17, N'صلاح الغراري', '176681851486', 2, '1990-08-19 08:22:46', '0925096544', 3, N'بنغازي', 1, 3, '2025-07-29 06:16:36');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (18, N'أميرة القماطي', '171098359496', 2, '1997-10-23 00:39:23', '0927432374', 6, N'غريان', 1, 3, '2025-08-12 07:13:43');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (19, N'أسماء الورفلي', '110067685851', 2, '2001-04-25 20:42:18', '0926092621', 8, N'سرت', 1, 1, '2025-07-22 09:09:58');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (20, N'صلاح العبيدي', '137324398902', 2, '1993-03-09 22:12:25', '0923445606', 3, N'طبرق', 1, 3, '2025-08-23 06:54:53');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (21, N'ابتسام القماطي', '119226072559', 2, '1977-09-29 02:17:02', '0914343839', 6, N'مصراتة', 1, 3, '2025-07-21 12:07:39');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (22, N'أسماء الترهوني', '157536889895', 2, '1999-11-10 03:48:44', '0919292355', 8, N'مصراتة', 1, 3, '2025-07-18 01:34:45');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (23, N'سلوى شرف الدين', '117675818773', 2, '1996-11-28 05:04:36', '0926981020', 1, N'بنغازي', 1, 3, '2025-08-26 08:00:31');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (24, N'خديجة القماطي', '175985263607', 2, '1991-04-27 15:28:32', '0922837517', 4, N'طبرق', 1, 3, '2025-07-22 04:55:38');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (25, N'هدى الشارف', '134011058449', 2, '1976-09-10 07:00:15', '0923302128', 5, N'الزاوية', 1, 3, '2025-08-14 05:39:20');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (26, N'وفاء الشيباني', '198690982812', 2, '1975-04-05 23:48:20', '0926103436', 4, N'سبها', 1, 3, '2025-08-06 20:09:41');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (27, N'عبد الله القماطي', '129621029625', 1, '1985-10-04 02:13:33', '0916134435', 2, N'الزاوية', 0, 3, '2025-08-06 15:51:55');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (28, N'سالم الزوي', '154406841590', 2, '2000-11-23 21:38:18', '0916374868', 4, N'سرت', 0, 3, '2025-08-07 21:17:54');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (29, N'عبد الله المجبري', '145059112149', 1, '2000-03-11 00:39:30', '0912811358', 2, N'طبرق', 1, 3, '2025-08-22 13:54:40');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (30, N'يوسف الترهوني', '170247454615', 2, '1976-05-27 15:55:02', '0916558501', 5, N'الخمس', 0, 3, '2025-08-04 16:32:48');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (31, N'خالد الورفلي', '160377922825', 1, '1992-05-11 15:37:23', '0915420506', 5, N'سبها', 1, 3, '2025-08-02 13:54:57');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (32, N'فاطمة العرفي', '153712811348', 2, '1995-01-14 15:23:48', '0927633253', 8, N'سبها', 1, 3, '2025-07-11 09:28:50');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (33, N'هناء الصادق', '165760366606', 2, '1994-08-21 00:15:21', '0919374286', 4, N'الخمس', 0, 3, '2025-08-30 10:04:12');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (34, N'مريم الترهوني', '123717379842', 2, '1986-06-27 08:27:45', '0926709051', 4, N'مصراتة', 1, 3, '2025-08-24 15:05:16');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (35, N'هدى الفيتوري', '152961505389', 2, '1986-05-15 15:52:53', '0927982105', 3, N'الزاوية', 1, 3, '2025-08-06 04:45:48');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (36, N'منى عبد الجليل', '169286111723', 2, '1996-12-13 11:07:29', '0919520915', 8, N'سرت', 0, 3, '2025-08-26 00:05:28');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (37, N'مريم عبد الجليل', '125614840894', 2, '1986-12-31 16:53:22', '0919635643', 7, N'طرابلس', 0, 3, '2025-07-06 23:52:00');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (38, N'هدى الزوي', '137199846225', 2, '1996-04-27 04:25:27', '0924937504', 5, N'ترهونة', 1, 3, '2025-07-17 14:29:03');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (39, N'سارة الشارف', '122318899345', 2, '1984-03-31 08:55:31', '0924381031', 1, N'سبها', 1, 3, '2025-07-23 00:05:06');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (40, N'علي الشيباني', '139445501511', 1, '1975-12-10 11:03:07', '0917560174', 4, N'مصراتة', 1, 3, '2025-08-15 13:52:41');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (41, N'علي الشيباني', '156970172389', 1, '1981-12-29 02:50:27', '0917518012', 6, N'مصراتة', 0, 3, '2025-07-01 05:57:55');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (42, N'حنان العجيلي', '132927587664', 2, '2002-12-03 07:32:11', '0919557467', 6, N'بنغازي', 1, 3, '2025-07-13 11:55:12');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (43, N'سليمان عبد الجليل', '123665848693', 2, '1986-07-09 12:57:56', '0925559467', 6, N'بنغازي', 1, 3, '2025-07-21 18:39:39');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (44, N'عائشة الشركسي', '188679059144', 2, '1979-04-17 05:27:01', '0929815757', 1, N'سبها', 1, 3, '2025-08-01 00:37:44');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (45, N'محمد المجبري', '187430961883', 1, '1979-10-17 23:57:31', '0912963888', 6, N'مصراتة', 1, 3, '2025-07-25 23:13:50');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (46, N'عبد الله الزوي', '161739133985', 1, '1984-10-14 20:53:21', '0914782925', 2, N'الزاوية', 1, 3, '2025-07-13 07:27:31');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (47, N'علي المصراتي', '164203331991', 1, '1977-12-18 21:30:50', '0918530013', 1, N'مصراتة', 0, 3, '2025-07-12 13:38:52');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (48, N'أسماء البوسيفي', '183162965436', 2, '1989-07-20 22:44:43', '0924544384', 7, N'سرت', 0, 3, '2025-08-23 10:50:54');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (49, N'نور الشارف', '113533827738', 2, '1984-08-26 16:11:06', '0925210669', 7, N'غريان', 0, 3, '2025-07-02 21:36:04');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (50, N'ليلى الزنتاني', '141657893779', 2, '1978-03-22 09:35:39', '0918452449', 5, N'ترهونة', 1, 3, '2025-08-19 14:04:24');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (51, N'فاطمة العجيلي', '141852268793', 2, '1977-07-28 07:14:03', '0912900131', 2, N'مصراتة', 1, 3, '2025-07-06 18:56:21');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (52, N'ابتسام عمار', '168459643315', 2, '1991-07-09 08:24:22', '0911920676', 2, N'سرت', 0, 3, '2025-07-11 00:42:18');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (53, N'منى القماطي', '151858143144', 2, '2000-08-31 13:52:17', '0913304106', 8, N'مصراتة', 0, 3, '2025-08-12 21:19:53');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (54, N'منى العبيدي', '150651372039', 2, '1985-10-04 14:38:52', '0915124606', 7, N'الزاوية', 1, 3, '2025-07-20 20:20:46');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (55, N'سارة العرفي', '155839526758', 2, '2000-06-17 07:35:46', '0919238237', 5, N'بنغازي', 1, 3, '2025-08-24 13:46:50');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (56, N'محمد الترهوني', '193681980588', 1, '1983-07-29 10:33:03', '0921570961', 3, N'الخمس', 1, 3, '2025-08-06 20:13:25');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (57, N'مريم العجيلي', '164589137289', 2, '2002-02-22 08:47:05', '0923298278', 2, N'الخمس', 1, 3, '2025-07-27 07:01:00');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (58, N'محمد عمار', '141055588654', 1, '1980-08-17 18:11:35', '0912632281', 1, N'طرابلس', 1, 3, '2025-08-20 08:33:34');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (59, N'جمال الورفلي', '165142115094', 2, '1988-04-18 06:35:54', '0921869380', 4, N'غريان', 1, 3, '2025-07-06 10:45:05');
INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])
VALUES (60, N'هدى الشيباني', '148522421227', 2, '1993-04-08 12:12:51', '0928825193', 7, N'طبرق', 1, 3, '2025-08-21 04:56:39');
SET IDENTITY_INSERT [Donors] OFF;

PRINT 'Inserting Patients...';
SET IDENTITY_INSERT [Patients] ON;
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (1, N'عادل الشارف', '269498036241', 2, '1983-08-01 16:37:23', '0915402859', N'مصراتة', 3, '2025-07-24 23:50:49');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (2, N'مريم عمار', '247908269909', 2, '1996-08-15 13:37:54', '0912410941', N'الخمس', 8, '2025-08-15 06:03:37');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (3, N'عبد الرحمن الترهوني', '295903084131', 1, '1970-04-05 21:20:11', '0914717395', N'ترهونة', 8, '2025-07-31 09:29:23');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (4, N'سالم المصراتي', '274383401951', 2, '1952-10-14 04:19:07', '0921422166', N'ترهونة', 8, '2025-07-07 16:47:13');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (5, N'عبد الرحمن شرف الدين', '272827111859', 1, '1951-09-12 03:32:32', '0914513522', N'سبها', 6, '2025-07-01 20:33:41');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (6, N'طارق الصادق', '254366251759', 2, '1998-03-24 10:55:23', '0924414482', N'طبرق', 4, '2025-08-27 17:07:27');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (7, N'مريم الفيتوري', '285054829083', 2, '1991-04-02 23:50:46', '0917352633', N'الخمس', 3, '2025-07-06 14:02:00');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (8, N'عائشة العرفي', '231355501746', 2, '1987-06-07 19:52:07', '0916748851', N'مصراتة', 4, '2025-07-05 21:05:50');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (9, N'عبد الله الشركسي', '211672157349', 1, '2005-05-02 16:04:30', '0913167620', N'طرابلس', 7, '2025-07-10 11:59:43');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (10, N'يوسف الزوي', '250030464808', 2, '1990-04-05 16:04:46', '0913907973', N'مصراتة', 3, '2025-07-04 17:33:40');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (11, N'أسماء عبد الجليل', '254187595549', 2, '1997-05-19 18:06:59', '0927168107', N'طبرق', 1, '2025-07-20 15:55:55');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (12, N'سليمان الشيباني', '261182384310', 2, '1990-12-13 23:18:00', '0926199186', N'غريان', 5, '2025-07-15 08:26:39');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (13, N'هدى الحداد', '295825657976', 2, '1950-04-04 10:32:08', '0928983565', N'طرابلس', 6, '2025-07-31 06:58:41');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (14, N'رانية التاجوري', '248780933147', 2, '2013-12-25 21:27:24', '0918174886', N'سبها', 2, '2025-07-10 18:14:41');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (15, N'أحمد الصادق', '246283185250', 1, '1959-03-22 11:50:15', '0924671611', N'الزاوية', 7, '2025-07-20 11:55:21');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (16, N'سليمان الشيباني', '255651561584', 2, '1978-08-31 14:43:37', '0913993076', N'سبها', 6, '2025-08-28 16:33:58');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (17, N'سارة الصادق', '276181708265', 2, '2002-01-17 03:02:38', '0923226049', N'ترهونة', 7, '2025-08-05 01:07:22');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (18, N'سلوى الشركسي', '261806494252', 2, '1969-03-21 19:40:42', '0926774521', N'ترهونة', 3, '2025-07-23 20:34:44');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (19, N'أحمد الصادق', '297919640375', 1, '1996-09-23 17:44:38', '0926138400', N'طبرق', 5, '2025-08-12 22:19:30');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (20, N'مصطفى المجبري', '214439220585', 1, '1999-08-04 12:52:36', '0926321250', N'سبها', 6, '2025-07-02 15:17:17');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (21, N'أمل الرياني', '271521876580', 2, '1987-11-09 19:07:10', '0926737687', N'ترهونة', 4, '2025-08-17 16:31:38');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (22, N'ليلى العرفي', '265677424003', 2, '1977-02-10 20:36:36', '0925101496', N'الخمس', 2, '2025-07-19 23:57:43');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (23, N'عادل الترهوني', '281949467724', 2, '2003-12-06 09:55:19', '0922435791', N'بنغازي', 1, '2025-07-05 00:10:51');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (24, N'عادل العبيدي', '293361138260', 2, '1954-03-11 01:23:05', '0919354140', N'غريان', 5, '2025-08-09 21:26:45');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (25, N'صلاح شرف الدين', '287944443350', 2, '1959-10-20 14:09:26', '0925074390', N'طبرق', 5, '2025-08-29 09:57:08');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (26, N'هناء التاجوري', '216949287365', 2, '1980-06-17 16:21:57', '0929698264', N'الزاوية', 1, '2025-08-05 05:48:25');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (27, N'أمل شرف الدين', '215082670864', 2, '1987-05-28 06:20:40', '0914971277', N'طبرق', 8, '2025-08-01 10:29:29');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (28, N'ابتسام عمار', '256999173955', 2, '2002-12-05 19:27:29', '0913895422', N'الزاوية', 1, '2025-08-15 09:07:33');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (29, N'سليمان الغراري', '216223782785', 2, '1954-11-07 05:49:54', '0928163009', N'الزاوية', 1, '2025-08-03 06:13:13');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (30, N'سعيد الزنتاني', '234052300004', 2, '1974-09-17 09:28:17', '0924360737', N'مصراتة', 5, '2025-08-20 14:22:54');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (31, N'خديجة عمار', '224415913588', 2, '2012-01-14 20:50:01', '0917795238', N'الخمس', 7, '2025-07-06 20:15:50');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (32, N'إبراهيم المصراتي', '220679951973', 2, '1988-08-08 06:57:12', '0916579627', N'سبها', 4, '2025-07-26 23:06:53');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (33, N'عبد الله القماطي', '233756228085', 1, '1962-11-28 18:35:58', '0929136987', N'الخمس', 4, '2025-08-24 07:26:10');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (34, N'سعيد المصراتي', '227326412691', 2, '1976-02-18 22:26:55', '0923492885', N'سرت', 5, '2025-08-10 12:13:41');
INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])
VALUES (35, N'مريم الفرجامي', '295833730229', 2, '1961-10-18 08:40:51', '0921580291', N'بنغازي', 2, '2025-07-03 14:49:44');
SET IDENTITY_INSERT [Patients] OFF;

PRINT 'Inserting Blood Requests...';
SET IDENTITY_INSERT [BloodRequests] ON;
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (1, 14, 2, 2, 1, 3, '2025-08-31 12:13:00', '2025-09-03 12:13:00', 3, N'حالة ولادة قيصرية', '2025-08-31 12:13:00');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (2, 13, 6, 4, 4, 2, '2025-10-20 00:15:34', '2025-10-21 00:15:34', 2, N'حالة ولادة قيصرية', '2025-10-20 00:15:34');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (3, 27, 8, 1, 1, 2, '2025-10-04 01:54:41', '2025-10-06 01:54:41', 2, NULL, '2025-10-04 01:54:41');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (4, 29, 1, 4, 4, 2, '2026-04-05 05:48:25', '2026-04-06 05:48:25', 2, N'حالة فقر دم حاد', '2026-04-05 05:48:25');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (5, 18, 3, 1, 1, 1, '2026-05-23 05:26:29', '2026-05-25 05:26:29', 2, NULL, '2026-05-23 05:26:29');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (6, 8, 4, 4, 4, 2, '2026-01-10 04:50:07', '2026-01-13 04:50:07', 2, N'حالة فقر دم حاد', '2026-01-10 04:50:07');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (7, 17, 7, 4, 4, 1, '2026-06-15 09:53:38', '2026-06-16 09:53:38', 2, NULL, '2026-06-15 09:53:38');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (8, 4, 8, 1, 1, 1, '2026-01-17 02:27:06', '2026-01-20 02:27:06', 2, NULL, '2026-01-17 02:27:06');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (9, 2, 8, 3, 0, 3, '2025-07-19 19:12:35', '2025-07-21 19:12:35', 4, N'حالة فقر دم حاد', '2025-07-19 19:12:35');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (10, 19, 5, 2, 2, 1, '2025-09-29 18:06:51', '2025-10-01 18:06:51', 2, N'حالة ولادة قيصرية', '2025-09-29 18:06:51');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (11, 26, 1, 1, 1, 2, '2026-05-26 12:09:48', '2026-05-27 12:09:48', 2, N'نزيف حاد نتيجة حادث سير', '2026-05-26 12:09:48');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (12, 35, 2, 3, 3, 1, '2026-03-20 07:34:57', '2026-03-22 07:34:57', 2, N'نزيف حاد نتيجة حادث سير', '2026-03-20 07:34:57');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (13, 10, 3, 2, 2, 1, '2026-01-26 23:07:52', '2026-01-28 23:07:52', 2, N'حالة ولادة قيصرية', '2026-01-26 23:07:52');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (14, 11, 1, 1, 1, 2, '2026-04-09 19:45:03', '2026-04-10 19:45:03', 2, N'حالة فقر دم حاد', '2026-04-09 19:45:03');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (15, 28, 1, 1, 1, 3, '2025-07-01 09:43:04', '2025-07-04 09:43:04', 2, N'حالة ولادة قيصرية', '2025-07-01 09:43:04');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (16, 16, 6, 3, 3, 2, '2026-03-05 05:42:26', '2026-03-08 05:42:26', 2, N'حالة فقر دم حاد', '2026-03-05 05:42:26');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (17, 1, 3, 1, 1, 2, '2025-12-03 23:03:47', '2025-12-05 23:03:47', 2, N'نزيف حاد نتيجة حادث سير', '2025-12-03 23:03:47');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (18, 17, 7, 2, 2, 1, '2026-04-06 08:54:50', '2026-04-08 08:54:50', 2, N'حالة ولادة قيصرية', '2026-04-06 08:54:50');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (19, 11, 1, 2, 2, 3, '2026-05-04 13:21:04', '2026-05-07 13:21:04', 2, N'حالة فقر دم حاد', '2026-05-04 13:21:04');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (20, 34, 5, 2, 2, 1, '2025-09-18 21:09:29', '2025-09-19 21:09:29', 2, N'نزيف حاد نتيجة حادث سير', '2025-09-18 21:09:29');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (21, 17, 7, 2, 0, 2, '2026-04-29 22:13:03', '2026-05-02 22:13:03', 4, N'عملية جراحية مستعجلة', '2026-04-29 22:13:03');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (22, 12, 5, 3, 3, 1, '2025-11-02 09:56:45', '2025-11-05 09:56:45', 2, N'عملية جراحية مستعجلة', '2025-11-02 09:56:45');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (23, 18, 3, 3, 2, 2, '2026-04-14 23:08:34', '2026-04-16 23:08:34', 3, N'حالة ولادة قيصرية', '2026-04-14 23:08:34');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (24, 25, 5, 3, 3, 1, '2025-09-11 02:17:41', '2025-09-14 02:17:41', 2, N'نزيف حاد نتيجة حادث سير', '2025-09-11 02:17:41');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (25, 11, 1, 3, 3, 3, '2026-06-12 07:44:39', '2026-06-14 07:44:39', 2, N'حالة فقر دم حاد', '2026-06-12 07:44:39');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (26, 20, 6, 3, 3, 1, '2026-02-23 01:52:37', '2026-02-24 01:52:37', 2, N'نزيف حاد نتيجة حادث سير', '2026-02-23 01:52:37');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (27, 21, 4, 3, 1, 2, '2025-08-21 04:24:13', '2025-08-24 04:24:13', 3, N'حالة ولادة قيصرية', '2025-08-21 04:24:13');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (28, 13, 6, 4, 4, 2, '2025-10-26 12:10:03', '2025-10-29 12:10:03', 2, N'حالة ولادة قيصرية', '2025-10-26 12:10:03');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (29, 33, 4, 1, 1, 1, '2026-05-17 02:57:02', '2026-05-18 02:57:02', 2, N'حالة فقر دم حاد', '2026-05-17 02:57:02');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (30, 23, 1, 2, 1, 2, '2025-10-24 04:08:07', '2025-10-25 04:08:07', 3, N'حالة فقر دم حاد', '2025-10-24 04:08:07');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (31, 29, 1, 4, 4, 3, '2026-03-28 22:12:45', '2026-03-29 22:12:45', 2, NULL, '2026-03-28 22:12:45');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (32, 9, 7, 1, 1, 2, '2025-07-11 11:24:06', '2025-07-14 11:24:06', 2, N'حالة ولادة قيصرية', '2025-07-11 11:24:06');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (33, 1, 3, 2, 2, 1, '2026-04-14 08:10:38', '2026-04-15 08:10:38', 2, N'نزيف حاد نتيجة حادث سير', '2026-04-14 08:10:38');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (34, 13, 6, 4, 1, 3, '2025-07-17 05:20:37', '2025-07-19 05:20:37', 3, N'حالة فقر دم حاد', '2025-07-17 05:20:37');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (35, 2, 8, 1, 0, 2, '2026-05-21 14:18:24', '2026-05-23 14:18:24', 4, N'عملية جراحية مستعجلة', '2026-05-21 14:18:24');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (36, 28, 1, 3, 3, 3, '2025-12-08 19:29:36', '2025-12-11 19:29:36', 2, N'حالة فقر دم حاد', '2025-12-08 19:29:36');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (37, 24, 5, 1, 1, 2, '2026-04-13 04:24:34', '2026-04-15 04:24:34', 2, N'حالة ولادة قيصرية', '2026-04-13 04:24:34');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (38, 29, 1, 3, 3, 2, '2025-11-02 11:39:37', '2025-11-05 11:39:37', 2, NULL, '2025-11-02 11:39:37');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (39, 10, 3, 4, 1, 3, '2025-10-03 10:38:22', '2025-10-05 10:38:22', 3, N'عملية جراحية مستعجلة', '2025-10-03 10:38:22');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (40, 11, 1, 1, 1, 3, '2025-10-21 22:37:50', '2025-10-23 22:37:50', 2, N'عملية جراحية مستعجلة', '2025-10-21 22:37:50');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (41, 30, 5, 4, 3, 3, '2026-03-16 05:50:43', '2026-03-18 05:50:43', 3, NULL, '2026-03-16 05:50:43');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (42, 6, 4, 2, 2, 1, '2026-04-03 19:41:04', '2026-04-04 19:41:04', 2, N'نزيف حاد نتيجة حادث سير', '2026-04-03 19:41:04');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (43, 4, 8, 3, 0, 1, '2025-07-07 08:13:05', '2025-07-10 08:13:05', 4, N'عملية جراحية مستعجلة', '2025-07-07 08:13:05');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (44, 4, 8, 3, 3, 1, '2025-11-06 18:18:16', '2025-11-08 18:18:16', 2, N'نزيف حاد نتيجة حادث سير', '2025-11-06 18:18:16');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (45, 18, 3, 3, 3, 2, '2025-07-08 17:14:56', '2025-07-11 17:14:56', 2, N'عملية جراحية مستعجلة', '2025-07-08 17:14:56');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (46, 7, 3, 2, 2, 3, '2026-04-16 12:49:24', '2026-04-18 12:49:24', 2, N'نزيف حاد نتيجة حادث سير', '2026-04-16 12:49:24');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (47, 1, 3, 4, 4, 2, '2026-02-21 10:18:59', '2026-02-23 10:18:59', 2, N'نزيف حاد نتيجة حادث سير', '2026-02-21 10:18:59');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (48, 32, 4, 1, 1, 3, '2026-02-18 13:51:30', '2026-02-21 13:51:30', 3, N'حالة فقر دم حاد', '2026-02-18 13:51:30');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (49, 2, 8, 2, 2, 1, '2026-03-19 01:28:33', '2026-03-20 01:28:33', 2, N'حالة فقر دم حاد', '2026-03-19 01:28:33');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (50, 35, 2, 4, 4, 2, '2025-08-05 01:46:35', '2025-08-06 01:46:35', 2, NULL, '2025-08-05 01:46:35');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (51, 20, 6, 3, 3, 3, '2025-12-26 10:41:07', '2025-12-29 10:41:07', 2, N'نزيف حاد نتيجة حادث سير', '2025-12-26 10:41:07');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (52, 5, 6, 2, 2, 1, '2025-09-24 09:04:09', '2025-09-26 09:04:09', 2, N'نزيف حاد نتيجة حادث سير', '2025-09-24 09:04:09');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (53, 6, 4, 3, 0, 3, '2026-05-01 10:07:35', '2026-05-03 10:07:35', 4, N'حالة فقر دم حاد', '2026-05-01 10:07:35');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (54, 31, 7, 1, 1, 3, '2026-03-16 12:33:16', '2026-03-18 12:33:16', 3, NULL, '2026-03-16 12:33:16');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (55, 12, 5, 4, 1, 1, '2026-04-06 13:47:55', '2026-04-07 13:47:55', 3, N'عملية جراحية مستعجلة', '2026-04-06 13:47:55');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (56, 4, 8, 2, 2, 1, '2026-02-07 00:07:56', '2026-02-10 00:07:56', 2, N'عملية جراحية مستعجلة', '2026-02-07 00:07:56');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (57, 4, 8, 3, 3, 1, '2026-04-04 19:03:39', '2026-04-07 19:03:39', 2, N'نزيف حاد نتيجة حادث سير', '2026-04-04 19:03:39');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (58, 26, 1, 1, 1, 2, '2026-03-19 04:57:08', '2026-03-20 04:57:08', 2, NULL, '2026-03-19 04:57:08');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (59, 19, 5, 3, 3, 3, '2026-05-20 10:23:33', '2026-05-22 10:23:33', 2, N'عملية جراحية مستعجلة', '2026-05-20 10:23:33');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (60, 9, 7, 4, 4, 2, '2025-10-02 18:48:36', '2025-10-03 18:48:36', 2, NULL, '2025-10-02 18:48:36');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (61, 29, 1, 2, 2, 3, '2025-07-16 08:31:23', '2025-07-19 08:31:23', 2, N'نزيف حاد نتيجة حادث سير', '2025-07-16 08:31:23');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (62, 9, 7, 3, 3, 2, '2025-12-05 07:12:26', '2025-12-06 07:12:26', 2, NULL, '2025-12-05 07:12:26');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (63, 10, 3, 2, 1, 1, '2025-08-20 00:15:43', '2025-08-21 00:15:43', 3, NULL, '2025-08-20 00:15:43');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (64, 19, 5, 1, 0, 3, '2026-06-21 17:38:30', '2026-06-23 17:38:30', 4, NULL, '2026-06-21 17:38:30');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (65, 29, 1, 1, 1, 2, '2026-02-05 06:46:57', '2026-02-07 06:46:57', 2, N'عملية جراحية مستعجلة', '2026-02-05 06:46:57');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (66, 28, 1, 2, 2, 1, '2025-12-24 03:42:18', '2025-12-25 03:42:18', 2, N'نزيف حاد نتيجة حادث سير', '2025-12-24 03:42:18');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (67, 32, 4, 2, 2, 3, '2025-08-27 02:29:47', '2025-08-28 02:29:47', 2, NULL, '2025-08-27 02:29:47');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (68, 35, 2, 2, 0, 2, '2026-03-24 02:34:21', '2026-03-27 02:34:21', 4, N'حالة ولادة قيصرية', '2026-03-24 02:34:21');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (69, 34, 5, 2, 0, 2, '2025-11-13 23:40:01', '2025-11-15 23:40:01', 4, N'نزيف حاد نتيجة حادث سير', '2025-11-13 23:40:01');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (70, 10, 3, 1, 1, 3, '2025-09-20 05:32:56', '2025-09-23 05:32:56', 2, N'عملية جراحية مستعجلة', '2025-09-20 05:32:56');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (71, 24, 5, 2, 2, 1, '2026-01-16 20:29:03', '2026-01-19 20:29:03', 2, N'عملية جراحية مستعجلة', '2026-01-16 20:29:03');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (72, 10, 3, 2, 1, 3, '2026-01-21 12:01:12', '2026-01-24 12:01:12', 3, N'حالة فقر دم حاد', '2026-01-21 12:01:12');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (73, 18, 3, 4, 4, 2, '2026-03-25 15:43:27', '2026-03-28 15:43:27', 2, N'نزيف حاد نتيجة حادث سير', '2026-03-25 15:43:27');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (74, 4, 8, 1, 1, 3, '2026-06-13 00:05:41', '2026-06-15 00:05:41', 2, N'حالة ولادة قيصرية', '2026-06-13 00:05:41');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (75, 3, 8, 2, 2, 1, '2025-08-18 03:35:47', '2025-08-19 03:35:47', 2, NULL, '2025-08-18 03:35:47');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (76, 20, 6, 2, 2, 3, '2025-07-12 16:04:26', '2025-07-13 16:04:26', 2, N'حالة ولادة قيصرية', '2025-07-12 16:04:26');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (77, 6, 4, 3, 3, 3, '2025-12-18 04:48:31', '2025-12-19 04:48:31', 2, N'نزيف حاد نتيجة حادث سير', '2025-12-18 04:48:31');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (78, 15, 7, 2, 2, 3, '2026-03-09 21:25:30', '2026-03-12 21:25:30', 2, N'حالة فقر دم حاد', '2026-03-09 21:25:30');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (79, 24, 5, 2, 2, 1, '2026-05-24 16:20:11', '2026-05-26 16:20:11', 2, N'نزيف حاد نتيجة حادث سير', '2026-05-24 16:20:11');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (80, 4, 8, 2, 0, 1, '2025-12-14 05:30:49', '2025-12-15 05:30:49', 4, N'عملية جراحية مستعجلة', '2025-12-14 05:30:49');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (81, 32, 4, 3, 3, 1, '2025-11-04 20:54:53', '2025-11-06 20:54:53', 2, NULL, '2025-11-04 20:54:53');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (82, 2, 8, 3, 3, 2, '2025-08-15 15:25:52', '2025-08-17 15:25:52', 2, N'حالة فقر دم حاد', '2025-08-15 15:25:52');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (83, 13, 6, 4, 0, 3, '2026-03-19 13:45:49', '2026-03-21 13:45:49', 4, N'حالة ولادة قيصرية', '2026-03-19 13:45:49');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (84, 9, 7, 4, 4, 3, '2025-09-06 17:14:28', '2025-09-07 17:14:28', 2, N'حالة ولادة قيصرية', '2025-09-06 17:14:28');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (85, 13, 6, 2, 2, 2, '2025-11-03 19:27:26', '2025-11-06 19:27:26', 2, N'عملية جراحية مستعجلة', '2025-11-03 19:27:26');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (86, 3, 8, 2, 2, 1, '2026-04-07 17:22:13', '2026-04-10 17:22:13', 2, N'حالة ولادة قيصرية', '2026-04-07 17:22:13');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (87, 30, 5, 2, 0, 3, '2026-05-06 21:49:20', '2026-05-07 21:49:20', 4, NULL, '2026-05-06 21:49:20');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (88, 5, 6, 3, 3, 1, '2025-08-16 17:01:33', '2025-08-19 17:01:33', 2, N'عملية جراحية مستعجلة', '2025-08-16 17:01:33');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (89, 22, 2, 4, 4, 3, '2026-05-01 08:48:05', '2026-05-02 08:48:05', 2, N'نزيف حاد نتيجة حادث سير', '2026-05-01 08:48:05');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (90, 27, 8, 4, 4, 2, '2025-11-17 06:04:32', '2025-11-20 06:04:32', 2, N'حالة فقر دم حاد', '2025-11-17 06:04:32');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (91, 21, 4, 2, 2, 3, '2025-09-08 17:59:40', '2025-09-09 17:59:40', 2, N'نزيف حاد نتيجة حادث سير', '2025-09-08 17:59:40');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (92, 11, 1, 2, 0, 1, '2025-12-09 08:04:00', '2025-12-10 08:04:00', 4, N'حالة فقر دم حاد', '2025-12-09 08:04:00');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (93, 5, 6, 1, 1, 3, '2025-09-02 16:45:05', '2025-09-03 16:45:05', 3, NULL, '2025-09-02 16:45:05');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (94, 14, 2, 3, 3, 2, '2026-04-23 00:49:54', '2026-04-25 00:49:54', 2, NULL, '2026-04-23 00:49:54');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (95, 35, 2, 2, 1, 2, '2026-06-02 12:08:37', '2026-06-05 12:08:37', 3, N'عملية جراحية مستعجلة', '2026-06-02 12:08:37');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (96, 15, 7, 3, 3, 2, '2026-04-01 21:14:26', '2026-04-02 21:14:26', 2, N'حالة فقر دم حاد', '2026-04-01 21:14:26');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (97, 5, 6, 1, 1, 2, '2026-03-11 05:05:56', '2026-03-13 05:05:56', 2, N'حالة فقر دم حاد', '2026-03-11 05:05:56');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (98, 1, 3, 4, 4, 2, '2025-08-03 07:21:03', '2025-08-04 07:21:03', 2, N'نزيف حاد نتيجة حادث سير', '2025-08-03 07:21:03');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (99, 1, 3, 3, 3, 1, '2026-01-07 00:27:43', '2026-01-10 00:27:43', 2, N'حالة ولادة قيصرية', '2026-01-07 00:27:43');
INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])
VALUES (100, 25, 5, 2, 1, 2, '2026-04-19 01:10:45', '2026-04-22 01:10:45', 3, N'حالة فقر دم حاد', '2026-04-19 01:10:45');
SET IDENTITY_INSERT [BloodRequests] OFF;

PRINT 'Inserting Donations...';
SET IDENTITY_INSERT [Donations] ON;
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (1, 4, 8, '2026-05-04 16:24:03', 500, 2, '2026-05-04 22:24:03', 1, N'تبرع عائلي لصالح مريض', '2026-05-04 16:24:03');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (2, 43, 6, '2026-05-05 11:56:30', 450, 1, NULL, 0, N'تبرع طوعي دوري', '2026-05-05 11:56:30');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (3, 13, 7, '2026-01-29 23:41:11', 350, 2, '2026-01-30 05:41:11', 1, NULL, '2026-01-29 23:41:11');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (4, 55, 5, '2026-05-28 00:36:51', 450, 2, '2026-05-28 06:36:51', 1, N'تبرع عائلي لصالح مريض', '2026-05-28 00:36:51');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (5, 40, 4, '2025-08-10 11:36:05', 450, 2, '2025-08-10 17:36:05', 1, N'تبرع طوعي دوري', '2025-08-10 11:36:05');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (6, 22, 8, '2025-09-13 17:49:51', 350, 2, '2025-09-13 23:49:51', 1, N'تبرع طوعي دوري', '2025-09-13 17:49:51');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (7, 31, 5, '2026-03-03 04:06:58', 450, 2, '2026-03-03 10:06:58', 1, N'بصحة جيدة بعد التبرع', '2026-03-03 04:06:58');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (8, 13, 7, '2026-02-07 02:04:08', 450, 1, NULL, 0, NULL, '2026-02-07 02:04:08');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (9, 21, 6, '2026-03-31 08:26:43', 450, 2, '2026-03-31 14:26:43', 1, N'بصحة جيدة بعد التبرع', '2026-03-31 08:26:43');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (10, 34, 4, '2025-07-01 06:18:50', 450, 2, '2025-07-01 12:18:50', 1, N'تبرع عائلي لصالح مريض', '2025-07-01 06:18:50');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (11, 13, 7, '2026-06-04 08:04:17', 350, 3, '2026-06-04 14:04:17', 0, NULL, '2026-06-04 08:04:17');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (12, 50, 5, '2026-04-24 03:19:34', 450, 2, '2026-04-24 09:19:34', 1, NULL, '2026-04-24 03:19:34');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (13, 26, 4, '2025-10-13 22:40:24', 500, 2, '2025-10-14 04:40:24', 1, N'بصحة جيدة بعد التبرع', '2025-10-13 22:40:24');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (14, 35, 3, '2026-04-08 19:55:49', 350, 2, '2026-04-09 01:55:49', 1, N'بصحة جيدة بعد التبرع', '2026-04-08 19:55:49');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (15, 25, 5, '2025-10-23 18:10:55', 450, 2, '2025-10-24 00:10:55', 1, N'تبرع طوعي دوري', '2025-10-23 18:10:55');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (16, 46, 2, '2025-09-29 18:19:54', 450, 2, '2025-09-30 00:19:54', 1, NULL, '2025-09-29 18:19:54');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (17, 54, 7, '2025-10-17 17:51:32', 500, 2, '2025-10-17 23:51:32', 1, N'تبرع طوعي دوري', '2025-10-17 17:51:32');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (18, 20, 3, '2025-07-30 06:09:32', 450, 2, '2025-07-30 12:09:32', 1, N'تبرع عائلي لصالح مريض', '2025-07-30 06:09:32');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (19, 25, 5, '2026-05-20 01:42:01', 450, 2, '2026-05-20 07:42:01', 1, N'تبرع عائلي لصالح مريض', '2026-05-20 01:42:01');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (20, 51, 2, '2026-02-27 00:23:41', 450, 2, '2026-02-27 06:23:41', 1, N'تبرع طوعي دوري', '2026-02-27 00:23:41');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (21, 14, 5, '2026-05-30 04:24:35', 450, 2, '2026-05-30 10:24:35', 1, N'تبرع عائلي لصالح مريض', '2026-05-30 04:24:35');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (22, 54, 7, '2025-11-16 04:55:58', 450, 2, '2025-11-16 10:55:58', 1, NULL, '2025-11-16 04:55:58');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (23, 60, 7, '2025-12-15 12:50:59', 450, 2, '2025-12-15 18:50:59', 1, N'بصحة جيدة بعد التبرع', '2025-12-15 12:50:59');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (24, 34, 4, '2026-06-27 18:09:47', 450, 2, '2026-06-28 00:09:47', 1, N'تبرع طوعي دوري', '2026-06-27 18:09:47');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (25, 25, 5, '2025-10-19 03:57:26', 450, 2, '2025-10-19 09:57:26', 1, N'تبرع عائلي لصالح مريض', '2025-10-19 03:57:26');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (26, 56, 3, '2026-02-04 17:24:11', 450, 2, '2026-02-04 23:24:11', 1, N'تبرع طوعي دوري', '2026-02-04 17:24:11');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (27, 56, 3, '2026-02-11 09:16:24', 500, 2, '2026-02-11 15:16:24', 1, N'بصحة جيدة بعد التبرع', '2026-02-11 09:16:24');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (28, 17, 3, '2025-08-30 14:35:00', 450, 2, '2025-08-30 20:35:00', 1, N'تبرع طوعي دوري', '2025-08-30 14:35:00');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (29, 51, 2, '2025-12-02 07:26:35', 500, 3, '2025-12-02 13:26:35', 0, NULL, '2025-12-02 07:26:35');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (30, 51, 2, '2025-08-10 02:10:16', 450, 3, '2025-08-10 08:10:16', 0, N'تبرع عائلي لصالح مريض', '2025-08-10 02:10:16');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (31, 26, 4, '2025-07-01 00:38:25', 450, 2, '2025-07-01 06:38:25', 1, N'تبرع طوعي دوري', '2025-07-01 00:38:25');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (32, 46, 2, '2026-02-15 18:10:52', 450, 2, '2026-02-16 00:10:52', 1, N'بصحة جيدة بعد التبرع', '2026-02-15 18:10:52');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (33, 59, 4, '2025-09-20 23:12:34', 450, 2, '2025-09-21 05:12:34', 1, N'تبرع طوعي دوري', '2025-09-20 23:12:34');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (34, 34, 4, '2026-04-02 22:12:52', 450, 2, '2026-04-03 04:12:52', 1, NULL, '2026-04-02 22:12:52');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (35, 59, 4, '2026-05-13 17:02:43', 350, 2, '2026-05-13 23:02:43', 1, N'تبرع طوعي دوري', '2026-05-13 17:02:43');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (36, 31, 5, '2025-10-02 05:03:23', 450, 3, '2025-10-02 11:03:23', 0, N'تبرع طوعي دوري', '2025-10-02 05:03:23');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (37, 12, 2, '2025-10-14 07:32:03', 450, 2, '2025-10-14 13:32:03', 1, NULL, '2025-10-14 07:32:03');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (38, 45, 6, '2025-07-16 05:31:29', 350, 2, '2025-07-16 11:31:29', 1, N'تبرع عائلي لصالح مريض', '2025-07-16 05:31:29');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (39, 22, 8, '2025-11-25 19:16:14', 450, 2, '2025-11-26 01:16:14', 1, N'تبرع طوعي دوري', '2025-11-25 19:16:14');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (40, 17, 3, '2025-11-10 11:53:57', 450, 2, '2025-11-10 17:53:57', 1, NULL, '2025-11-10 11:53:57');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (41, 6, 1, '2025-10-21 15:13:53', 450, 2, '2025-10-21 21:13:53', 1, N'تبرع طوعي دوري', '2025-10-21 15:13:53');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (42, 20, 3, '2025-08-23 04:07:37', 450, 2, '2025-08-23 10:07:37', 1, N'تبرع عائلي لصالح مريض', '2025-08-23 04:07:37');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (43, 13, 7, '2026-05-16 07:56:58', 450, 2, '2026-05-16 13:56:58', 1, N'تبرع عائلي لصالح مريض', '2026-05-16 07:56:58');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (44, 17, 3, '2025-12-15 00:31:01', 500, 2, '2025-12-15 06:31:01', 1, N'تبرع طوعي دوري', '2025-12-15 00:31:01');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (45, 60, 7, '2025-11-04 04:13:27', 450, 2, '2025-11-04 10:13:27', 1, N'بصحة جيدة بعد التبرع', '2025-11-04 04:13:27');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (46, 55, 5, '2025-08-18 20:01:40', 450, 2, '2025-08-19 02:01:40', 1, N'تبرع طوعي دوري', '2025-08-18 20:01:40');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (47, 26, 4, '2026-05-21 22:35:16', 450, 2, '2026-05-22 04:35:16', 1, NULL, '2026-05-21 22:35:16');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (48, 32, 8, '2025-11-10 00:38:14', 500, 2, '2025-11-10 06:38:14', 1, N'بصحة جيدة بعد التبرع', '2025-11-10 00:38:14');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (49, 6, 1, '2026-06-21 14:05:28', 450, 2, '2026-06-21 20:05:28', 1, NULL, '2026-06-21 14:05:28');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (50, 6, 1, '2026-06-04 08:23:10', 450, 2, '2026-06-04 14:23:10', 1, NULL, '2026-06-04 08:23:10');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (51, 23, 1, '2025-07-29 10:11:41', 350, 2, '2025-07-29 16:11:41', 1, N'بصحة جيدة بعد التبرع', '2025-07-29 10:11:41');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (52, 40, 4, '2026-02-21 08:21:45', 450, 2, '2026-02-21 14:21:45', 1, N'تبرع طوعي دوري', '2026-02-21 08:21:45');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (53, 20, 3, '2026-02-01 13:40:12', 500, 2, '2026-02-01 19:40:12', 1, N'تبرع طوعي دوري', '2026-02-01 13:40:12');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (54, 4, 8, '2026-03-19 06:50:06', 350, 2, '2026-03-19 12:50:06', 1, N'تبرع عائلي لصالح مريض', '2026-03-19 06:50:06');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (55, 38, 5, '2026-01-30 23:05:26', 500, 2, '2026-01-31 05:05:26', 1, N'تبرع عائلي لصالح مريض', '2026-01-30 23:05:26');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (56, 46, 2, '2025-09-05 07:23:03', 500, 2, '2025-09-05 13:23:03', 1, NULL, '2025-09-05 07:23:03');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (57, 59, 4, '2025-10-10 12:49:44', 450, 2, '2025-10-10 18:49:44', 1, N'بصحة جيدة بعد التبرع', '2025-10-10 12:49:44');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (58, 31, 5, '2026-02-21 18:16:59', 450, 2, '2026-02-22 00:16:59', 1, N'تبرع طوعي دوري', '2026-02-21 18:16:59');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (59, 39, 1, '2026-05-26 13:17:35', 500, 2, '2026-05-26 19:17:35', 1, N'بصحة جيدة بعد التبرع', '2026-05-26 13:17:35');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (60, 45, 6, '2025-10-08 00:26:04', 450, 2, '2025-10-08 06:26:04', 1, N'تبرع طوعي دوري', '2025-10-08 00:26:04');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (61, 6, 1, '2025-07-08 18:08:09', 500, 2, '2025-07-09 00:08:09', 1, N'تبرع طوعي دوري', '2025-07-08 18:08:09');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (62, 21, 6, '2026-01-02 23:33:09', 450, 2, '2026-01-03 05:33:09', 1, N'تبرع طوعي دوري', '2026-01-02 23:33:09');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (63, 51, 2, '2025-11-29 18:30:39', 450, 2, '2025-11-30 00:30:39', 1, N'تبرع عائلي لصالح مريض', '2025-11-29 18:30:39');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (64, 1, 3, '2025-09-01 09:34:45', 500, 2, '2025-09-01 15:34:45', 1, N'بصحة جيدة بعد التبرع', '2025-09-01 09:34:45');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (65, 25, 5, '2026-03-02 04:10:25', 450, 2, '2026-03-02 10:10:25', 1, N'بصحة جيدة بعد التبرع', '2026-03-02 04:10:25');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (66, 8, 3, '2026-05-03 09:09:31', 350, 2, '2026-05-03 15:09:31', 1, NULL, '2026-05-03 09:09:31');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (67, 4, 8, '2025-10-09 10:18:41', 350, 2, '2025-10-09 16:18:41', 1, N'تبرع عائلي لصالح مريض', '2025-10-09 10:18:41');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (68, 46, 2, '2026-04-21 18:04:12', 500, 2, '2026-04-22 00:04:12', 1, N'بصحة جيدة بعد التبرع', '2026-04-21 18:04:12');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (69, 10, 7, '2026-03-03 00:23:32', 450, 2, '2026-03-03 06:23:32', 1, NULL, '2026-03-03 00:23:32');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (70, 42, 6, '2025-07-09 19:21:22', 350, 2, '2025-07-10 01:21:22', 1, NULL, '2025-07-09 19:21:22');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (71, 29, 2, '2025-12-08 19:19:19', 450, 2, '2025-12-09 01:19:19', 1, N'تبرع عائلي لصالح مريض', '2025-12-08 19:19:19');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (72, 58, 1, '2026-01-31 18:06:18', 500, 1, NULL, 0, NULL, '2026-01-31 18:06:18');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (73, 22, 8, '2026-03-28 18:34:20', 350, 2, '2026-03-29 00:34:20', 1, N'تبرع طوعي دوري', '2026-03-28 18:34:20');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (74, 22, 8, '2025-10-19 13:27:51', 500, 2, '2025-10-19 19:27:51', 1, N'تبرع عائلي لصالح مريض', '2025-10-19 13:27:51');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (75, 45, 6, '2026-02-23 07:06:57', 500, 3, '2026-02-23 13:06:57', 0, N'تبرع طوعي دوري', '2026-02-23 07:06:57');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (76, 58, 1, '2026-04-22 10:24:49', 350, 1, NULL, 0, NULL, '2026-04-22 10:24:49');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (77, 40, 4, '2026-04-05 20:01:55', 350, 2, '2026-04-06 02:01:55', 1, N'تبرع عائلي لصالح مريض', '2026-04-05 20:01:55');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (78, 1, 3, '2026-03-14 05:50:34', 350, 2, '2026-03-14 11:50:34', 1, N'تبرع طوعي دوري', '2026-03-14 05:50:34');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (79, 34, 4, '2025-12-31 01:43:22', 500, 2, '2025-12-31 07:43:22', 1, N'بصحة جيدة بعد التبرع', '2025-12-31 01:43:22');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (80, 51, 2, '2025-08-16 11:16:43', 450, 3, '2025-08-16 17:16:43', 0, NULL, '2025-08-16 11:16:43');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (81, 24, 4, '2026-06-08 11:51:30', 450, 2, '2026-06-08 17:51:30', 1, NULL, '2026-06-08 11:51:30');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (82, 44, 1, '2025-08-18 02:24:11', 500, 2, '2025-08-18 08:24:11', 1, N'تبرع طوعي دوري', '2025-08-18 02:24:11');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (83, 16, 6, '2025-08-20 16:21:33', 500, 3, '2025-08-20 22:21:33', 0, N'تبرع عائلي لصالح مريض', '2025-08-20 16:21:33');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (84, 14, 5, '2026-04-28 08:49:57', 500, 1, NULL, 0, N'تبرع عائلي لصالح مريض', '2026-04-28 08:49:57');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (85, 58, 1, '2025-09-22 15:25:25', 500, 3, '2025-09-22 21:25:25', 0, N'بصحة جيدة بعد التبرع', '2025-09-22 15:25:25');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (86, 17, 3, '2025-12-10 04:41:45', 350, 2, '2025-12-10 10:41:45', 1, N'بصحة جيدة بعد التبرع', '2025-12-10 04:41:45');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (87, 50, 5, '2025-07-03 01:56:06', 350, 2, '2025-07-03 07:56:06', 1, N'تبرع عائلي لصالح مريض', '2025-07-03 01:56:06');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (88, 4, 8, '2026-04-08 10:00:48', 450, 2, '2026-04-08 16:00:48', 1, N'بصحة جيدة بعد التبرع', '2026-04-08 10:00:48');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (89, 4, 8, '2026-06-18 18:41:11', 450, 2, '2026-06-19 00:41:11', 1, NULL, '2026-06-18 18:41:11');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (90, 42, 6, '2026-04-25 09:09:25', 450, 2, '2026-04-25 15:09:25', 1, N'بصحة جيدة بعد التبرع', '2026-04-25 09:09:25');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (91, 34, 4, '2026-03-04 10:14:08', 350, 2, '2026-03-04 16:14:08', 1, N'تبرع طوعي دوري', '2026-03-04 10:14:08');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (92, 29, 2, '2025-09-25 06:10:51', 450, 2, '2025-09-25 12:10:51', 1, N'بصحة جيدة بعد التبرع', '2025-09-25 06:10:51');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (93, 19, 8, '2025-10-08 15:20:23', 450, 2, '2025-10-08 21:20:23', 1, NULL, '2025-10-08 15:20:23');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (94, 21, 6, '2025-11-04 21:33:27', 450, 2, '2025-11-05 03:33:27', 1, N'تبرع طوعي دوري', '2025-11-04 21:33:27');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (95, 4, 8, '2026-05-20 19:11:18', 350, 2, '2026-05-21 01:11:18', 1, N'تبرع طوعي دوري', '2026-05-20 19:11:18');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (96, 6, 1, '2025-09-03 17:59:34', 350, 2, '2025-09-03 23:59:34', 1, N'تبرع طوعي دوري', '2025-09-03 17:59:34');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (97, 4, 8, '2025-12-29 19:48:23', 450, 2, '2025-12-30 01:48:23', 1, N'بصحة جيدة بعد التبرع', '2025-12-29 19:48:23');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (98, 59, 4, '2025-09-06 21:26:57', 450, 2, '2025-09-07 03:26:57', 1, N'بصحة جيدة بعد التبرع', '2025-09-06 21:26:57');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (99, 12, 2, '2025-08-18 01:17:54', 350, 2, '2025-08-18 07:17:54', 1, NULL, '2025-08-18 01:17:54');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (100, 23, 1, '2025-09-08 11:08:38', 450, 2, '2025-09-08 17:08:38', 1, NULL, '2025-09-08 11:08:38');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (101, 14, 5, '2026-04-26 10:55:11', 350, 2, '2026-04-26 16:55:11', 1, N'تبرع طوعي دوري', '2026-04-26 10:55:11');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (102, 29, 2, '2025-07-17 19:46:35', 350, 2, '2025-07-18 01:46:35', 1, N'بصحة جيدة بعد التبرع', '2025-07-17 19:46:35');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (103, 10, 7, '2025-07-23 20:59:54', 500, 2, '2025-07-24 02:59:54', 1, N'تبرع عائلي لصالح مريض', '2025-07-23 20:59:54');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (104, 44, 1, '2025-08-21 23:37:21', 500, 2, '2025-08-22 05:37:21', 1, N'بصحة جيدة بعد التبرع', '2025-08-21 23:37:21');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (105, 9, 6, '2026-04-09 15:09:06', 450, 2, '2026-04-09 21:09:06', 1, NULL, '2026-04-09 15:09:06');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (106, 18, 6, '2025-08-28 21:21:50', 500, 2, '2025-08-29 03:21:50', 1, N'تبرع عائلي لصالح مريض', '2025-08-28 21:21:50');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (107, 15, 1, '2026-01-02 14:22:16', 350, 2, '2026-01-02 20:22:16', 1, N'تبرع عائلي لصالح مريض', '2026-01-02 14:22:16');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (108, 14, 5, '2025-10-07 00:14:25', 350, 2, '2025-10-07 06:14:25', 1, N'تبرع طوعي دوري', '2025-10-07 00:14:25');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (109, 34, 4, '2025-10-06 11:00:32', 450, 2, '2025-10-06 17:00:32', 1, NULL, '2025-10-06 11:00:32');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (110, 51, 2, '2026-01-15 09:09:59', 500, 2, '2026-01-15 15:09:59', 1, NULL, '2026-01-15 09:09:59');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (111, 55, 5, '2026-02-27 01:22:39', 450, 2, '2026-02-27 07:22:39', 1, N'بصحة جيدة بعد التبرع', '2026-02-27 01:22:39');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (112, 16, 6, '2026-01-25 04:51:49', 450, 2, '2026-01-25 10:51:49', 1, NULL, '2026-01-25 04:51:49');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (113, 16, 6, '2025-07-16 23:04:16', 450, 2, '2025-07-17 05:04:16', 1, N'تبرع طوعي دوري', '2025-07-16 23:04:16');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (114, 13, 7, '2026-04-18 03:47:47', 450, 2, '2026-04-18 09:47:47', 1, N'تبرع عائلي لصالح مريض', '2026-04-18 03:47:47');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (115, 32, 8, '2025-09-09 09:43:34', 450, 2, '2025-09-09 15:43:34', 1, NULL, '2025-09-09 09:43:34');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (116, 42, 6, '2025-09-01 18:13:00', 450, 2, '2025-09-02 00:13:00', 1, N'بصحة جيدة بعد التبرع', '2025-09-01 18:13:00');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (117, 14, 5, '2026-03-04 08:09:31', 450, 3, '2026-03-04 14:09:31', 0, NULL, '2026-03-04 08:09:31');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (118, 44, 1, '2026-04-18 15:40:13', 450, 2, '2026-04-18 21:40:13', 1, NULL, '2026-04-18 15:40:13');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (119, 16, 6, '2026-03-06 22:36:45', 350, 2, '2026-03-07 04:36:45', 1, N'تبرع عائلي لصالح مريض', '2026-03-06 22:36:45');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (120, 32, 8, '2026-04-12 19:35:58', 450, 2, '2026-04-13 01:35:58', 1, N'بصحة جيدة بعد التبرع', '2026-04-12 19:35:58');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (121, 13, 7, '2025-12-17 20:09:12', 450, 2, '2025-12-18 02:09:12', 1, N'تبرع طوعي دوري', '2025-12-17 20:09:12');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (122, 31, 5, '2026-02-27 23:07:37', 450, 2, '2026-02-28 05:07:37', 1, N'تبرع عائلي لصالح مريض', '2026-02-27 23:07:37');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (123, 25, 5, '2026-05-16 20:19:11', 450, 2, '2026-05-17 02:19:11', 1, N'بصحة جيدة بعد التبرع', '2026-05-16 20:19:11');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (124, 1, 3, '2025-08-10 23:02:47', 500, 2, '2025-08-11 05:02:47', 1, N'بصحة جيدة بعد التبرع', '2025-08-10 23:02:47');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (125, 55, 5, '2026-05-29 10:28:55', 350, 2, '2026-05-29 16:28:55', 1, NULL, '2026-05-29 10:28:55');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (126, 54, 7, '2026-02-15 02:21:22', 500, 2, '2026-02-15 08:21:22', 1, N'بصحة جيدة بعد التبرع', '2026-02-15 02:21:22');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (127, 31, 5, '2025-11-29 11:46:20', 450, 2, '2025-11-29 17:46:20', 1, N'تبرع طوعي دوري', '2025-11-29 11:46:20');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (128, 40, 4, '2025-12-18 10:27:32', 450, 2, '2025-12-18 16:27:32', 1, NULL, '2025-12-18 10:27:32');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (129, 57, 2, '2025-11-22 19:16:31', 450, 2, '2025-11-23 01:16:31', 1, N'تبرع عائلي لصالح مريض', '2025-11-22 19:16:31');
INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])
VALUES (130, 16, 6, '2025-09-21 06:11:58', 450, 2, '2025-09-21 12:11:58', 1, NULL, '2025-09-21 06:11:58');
SET IDENTITY_INSERT [Donations] OFF;

PRINT 'Inserting Donor Responses...';
SET IDENTITY_INSERT [DonorRequestResponses] ON;
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (1, 10, 78, 2, N'تواصل هاتفي ناجح', NULL, '2026-03-11 06:25:30', '2026-03-11 06:25:30');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (2, 47, 15, 2, N'تم تأكيد الموعد', NULL, '2025-07-01 16:43:04', '2025-07-01 16:43:04');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (3, 45, 93, 2, N'مستعد للحضور فوراً', NULL, '2025-09-03 09:45:05', '2025-09-03 09:45:05');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (4, 37, 24, 2, NULL, NULL, '2025-09-11 05:17:41', '2025-09-11 05:17:41');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (5, 13, 18, 2, N'تم تأكيد الموعد', NULL, '2026-04-06 14:54:50', '2026-04-06 14:54:50');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (6, 36, 62, 2, N'مستعد للحضور فوراً', NULL, '2025-12-05 19:12:26', '2025-12-05 19:12:26');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (7, 4, 81, 2, N'تم تأكيد الموعد', NULL, '2025-11-05 21:54:53', '2025-11-05 21:54:53');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (8, 53, 14, 2, N'مستعد للحضور فوراً', NULL, '2026-04-11 06:45:03', '2026-04-11 06:45:03');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (9, 49, 38, 2, N'مستعد للحضور فوراً', NULL, '2025-11-02 20:39:37', '2025-11-02 20:39:37');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (10, 38, 41, 2, N'تم تأكيد الموعد', NULL, '2026-03-18 04:50:43', '2026-03-18 04:50:43');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (11, 21, 34, 1, N'مستعد للحضور فوراً', NULL, '2025-07-18 17:20:37', '2025-07-18 17:20:37');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (12, 19, 3, 3, N'تواصل هاتفي ناجح', 93, '2025-10-05 08:54:41', '2025-10-05 08:54:41');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (13, 60, 49, 2, N'تواصل هاتفي ناجح', NULL, '2026-03-19 02:28:33', '2026-03-19 02:28:33');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (14, 37, 61, 2, N'تم تأكيد الموعد', NULL, '2025-07-17 06:31:23', '2025-07-17 06:31:23');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (15, 36, 10, 2, N'تم تأكيد الموعد', NULL, '2025-09-30 20:06:51', '2025-09-30 20:06:51');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (16, 4, 94, 2, NULL, NULL, '2026-04-24 01:49:54', '2026-04-24 01:49:54');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (17, 19, 88, 2, N'مستعد للحضور فوراً', NULL, '2025-08-16 18:01:33', '2025-08-16 18:01:33');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (18, 23, 30, 2, N'مستعد للحضور فوراً', NULL, '2025-10-25 15:08:07', '2025-10-25 15:08:07');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (19, 53, 93, 2, N'تم تأكيد الموعد', NULL, '2025-09-02 17:45:05', '2025-09-02 17:45:05');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (20, 12, 12, 2, N'مستعد للحضور فوراً', NULL, '2026-03-21 06:34:57', '2026-03-21 06:34:57');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (21, 10, 80, 6, N'مستعد للحضور فوراً', NULL, '2025-12-15 20:30:49', '2025-12-15 20:30:49');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (22, 48, 57, 2, N'تم تأكيد الموعد', NULL, '2026-04-06 08:03:39', '2026-04-06 08:03:39');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (23, 6, 14, 2, N'تواصل هاتفي ناجح', NULL, '2026-04-10 21:45:03', '2026-04-10 21:45:03');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (24, 19, 95, 1, N'تواصل هاتفي ناجح', NULL, '2026-06-02 17:08:37', '2026-06-02 17:08:37');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (25, 4, 59, 3, NULL, 95, '2026-05-22 03:23:33', '2026-05-22 03:23:33');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (26, 11, 39, 1, NULL, NULL, '2025-10-03 22:38:22', '2025-10-03 22:38:22');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (27, 22, 18, 2, N'مستعد للحضور فوراً', NULL, '2026-04-06 11:54:50', '2026-04-06 11:54:50');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (28, 36, 98, 2, N'تواصل هاتفي ناجح', NULL, '2025-08-04 16:21:03', '2025-08-04 16:21:03');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (29, 47, 65, 2, N'تم تأكيد الموعد', NULL, '2026-02-06 03:46:57', '2026-02-06 03:46:57');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (30, 35, 70, 2, NULL, NULL, '2025-09-20 14:32:56', '2025-09-20 14:32:56');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (31, 54, 77, 2, N'تواصل هاتفي ناجح', NULL, '2025-12-18 15:48:31', '2025-12-18 15:48:31');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (32, 13, 21, 6, N'تم تأكيد الموعد', NULL, '2026-04-30 18:13:03', '2026-04-30 18:13:03');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (33, 3, 4, 2, N'مستعد للحضور فوراً', NULL, '2026-04-06 08:48:25', '2026-04-06 08:48:25');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (34, 48, 58, 2, N'مستعد للحضور فوراً', NULL, '2026-03-19 07:57:08', '2026-03-19 07:57:08');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (35, 22, 90, 2, N'تواصل هاتفي ناجح', NULL, '2025-11-18 11:04:32', '2025-11-18 11:04:32');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (36, 9, 52, 2, NULL, NULL, '2025-09-25 22:04:09', '2025-09-25 22:04:09');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (37, 60, 5, 2, N'مستعد للحضور فوراً', NULL, '2026-05-23 13:26:29', '2026-05-23 13:26:29');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (38, 53, 63, 2, N'مستعد للحضور فوراً', NULL, '2025-08-21 18:15:43', '2025-08-21 18:15:43');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (39, 35, 72, 1, N'مستعد للحضور فوراً', NULL, '2026-01-23 03:01:12', '2026-01-23 03:01:12');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (40, 22, 56, 2, N'تم تأكيد الموعد', NULL, '2026-02-07 08:07:56', '2026-02-07 08:07:56');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (41, 53, 88, 2, NULL, NULL, '2025-08-17 00:01:33', '2025-08-17 00:01:33');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (42, 19, 32, 2, N'تم تأكيد الموعد', NULL, '2025-07-12 13:24:06', '2025-07-12 13:24:06');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (43, 17, 63, 2, N'مستعد للحضور فوراً', NULL, '2025-08-21 09:15:43', '2025-08-21 09:15:43');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (44, 37, 23, 1, N'تواصل هاتفي ناجح', NULL, '2026-04-16 08:08:34', '2026-04-16 08:08:34');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (45, 53, 13, 2, N'تم تأكيد الموعد', NULL, '2026-01-28 18:07:52', '2026-01-28 18:07:52');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (46, 60, 71, 2, N'تم تأكيد الموعد', NULL, '2026-01-17 13:29:03', '2026-01-17 13:29:03');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (47, 39, 25, 2, N'تواصل هاتفي ناجح', NULL, '2026-06-13 02:44:39', '2026-06-13 02:44:39');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (48, 36, 38, 2, N'مستعد للحضور فوراً', NULL, '2025-11-03 15:39:37', '2025-11-03 15:39:37');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (49, 36, 4, 2, N'تم تأكيد الموعد', NULL, '2026-04-06 17:48:25', '2026-04-06 17:48:25');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (50, 25, 69, 6, N'تم تأكيد الموعد', NULL, '2025-11-15 13:40:01', '2025-11-15 13:40:01');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (51, 10, 81, 2, N'تم تأكيد الموعد', NULL, '2025-11-06 07:54:53', '2025-11-06 07:54:53');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (52, 60, 19, 2, NULL, NULL, '2026-05-06 00:21:04', '2026-05-06 00:21:04');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (53, 22, 81, 2, NULL, NULL, '2025-11-06 04:54:53', '2025-11-06 04:54:53');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (54, 22, 51, 2, NULL, NULL, '2025-12-26 12:41:07', '2025-12-26 12:41:07');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (55, 43, 28, 2, N'مستعد للحضور فوراً', NULL, '2025-10-26 16:10:03', '2025-10-26 16:10:03');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (56, 60, 78, 2, N'تواصل هاتفي ناجح', NULL, '2026-03-11 06:25:30', '2026-03-11 06:25:30');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (57, 13, 86, 2, N'تم تأكيد الموعد', NULL, '2026-04-09 17:22:13', '2026-04-09 17:22:13');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (58, 37, 99, 2, N'مستعد للحضور فوراً', NULL, '2026-01-08 18:27:43', '2026-01-08 18:27:43');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (59, 19, 67, 2, N'تم تأكيد الموعد', NULL, '2025-08-28 17:29:47', '2025-08-28 17:29:47');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (60, 53, 43, 6, N'تم تأكيد الموعد', NULL, '2025-07-08 07:13:05', '2025-07-08 07:13:05');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (61, 60, 58, 2, N'مستعد للحضور فوراً', NULL, '2026-03-20 18:57:08', '2026-03-20 18:57:08');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (62, 53, 90, 2, NULL, NULL, '2025-11-18 10:04:32', '2025-11-18 10:04:32');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (63, 22, 41, 1, N'تم تأكيد الموعد', NULL, '2026-03-17 21:50:43', '2026-03-17 21:50:43');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (64, 32, 15, 2, N'تواصل هاتفي ناجح', NULL, '2025-07-02 08:43:04', '2025-07-02 08:43:04');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (65, 17, 70, 2, N'مستعد للحضور فوراً', NULL, '2025-09-21 19:32:56', '2025-09-21 19:32:56');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (66, 37, 25, 2, N'مستعد للحضور فوراً', NULL, '2026-06-12 12:44:39', '2026-06-12 12:44:39');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (67, 33, 42, 2, N'تم تأكيد الموعد', NULL, '2026-04-04 23:41:04', '2026-04-04 23:41:04');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (68, 13, 30, 1, N'تم تأكيد الموعد', NULL, '2025-10-25 08:08:07', '2025-10-25 08:08:07');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (69, 18, 52, 2, N'مستعد للحضور فوراً', NULL, '2025-09-26 05:04:09', '2025-09-26 05:04:09');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (70, 50, 20, 2, N'مستعد للحضور فوراً', NULL, '2025-09-19 13:09:29', '2025-09-19 13:09:29');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (71, 37, 44, 2, N'تم تأكيد الموعد', NULL, '2025-11-08 13:18:16', '2025-11-08 13:18:16');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (72, 34, 77, 2, NULL, NULL, '2025-12-18 21:48:31', '2025-12-18 21:48:31');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (73, 36, 85, 2, NULL, NULL, '2025-11-04 06:27:26', '2025-11-04 06:27:26');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (74, 31, 71, 2, N'تم تأكيد الموعد', NULL, '2026-01-18 00:29:03', '2026-01-18 00:29:03');
INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])
VALUES (75, 4, 75, 2, N'تم تأكيد الموعد', NULL, '2025-08-19 00:35:47', '2025-08-19 00:35:47');
SET IDENTITY_INSERT [DonorRequestResponses] OFF;

PRINT 'Inserting Blood Inventory Items...';
SET IDENTITY_INSERT [BloodInventoryItems] ON;
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (1, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 1, 1, 4, 0, '2026-06-08 16:24:03', '2026-05-04 16:24:03');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (2, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 3, 1, 3, 1, '2026-03-05 23:41:11', '2026-01-29 23:41:11');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (3, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 4, 1, 1, 0, '2026-07-02 00:36:51', '2026-05-28 00:36:51');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (4, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 5, 1, 3, 1, '2025-09-14 11:36:05', '2025-08-10 11:36:05');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (5, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 6, 1, 4, 0, '2025-10-18 17:49:51', '2025-09-13 17:49:51');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (6, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 7, 1, 3, 1, '2026-04-07 04:06:58', '2026-03-03 04:06:58');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (7, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 9, 1, 3, 1, '2026-05-05 08:26:43', '2026-03-31 08:26:43');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (8, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 10, 1, 3, 1, '2025-08-05 06:18:50', '2025-07-01 06:18:50');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (9, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 12, 1, 3, 1, '2026-05-29 03:19:34', '2026-04-24 03:19:34');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (10, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 13, 1, 3, 1, '2025-11-17 22:40:24', '2025-10-13 22:40:24');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (11, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 14, 1, 3, 1, '2026-05-13 19:55:49', '2026-04-08 19:55:49');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (12, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 15, 1, 3, 1, '2025-11-27 18:10:55', '2025-10-23 18:10:55');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (13, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 16, 1, 3, 1, '2025-11-03 18:19:54', '2025-09-29 18:19:54');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (14, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 17, 1, 4, 0, '2025-11-21 17:51:32', '2025-10-17 17:51:32');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (15, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 18, 1, 3, 1, '2025-09-03 06:09:32', '2025-07-30 06:09:32');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (16, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 19, 1, 3, 1, '2026-06-24 01:42:01', '2026-05-20 01:42:01');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (17, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 20, 1, 3, 1, '2026-04-03 00:23:41', '2026-02-27 00:23:41');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (18, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 21, 1, 1, 0, '2026-07-04 04:24:35', '2026-05-30 04:24:35');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (19, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 22, 1, 3, 1, '2025-12-21 04:55:58', '2025-11-16 04:55:58');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (20, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 23, 1, 3, 1, '2026-01-19 12:50:59', '2025-12-15 12:50:59');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (21, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 24, 1, 1, 0, '2026-08-01 18:09:47', '2026-06-27 18:09:47');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (22, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 25, 1, 4, 0, '2025-11-23 03:57:26', '2025-10-19 03:57:26');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (23, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 26, 1, 4, 0, '2026-03-11 17:24:11', '2026-02-04 17:24:11');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (24, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 27, 1, 3, 1, '2026-03-18 09:16:24', '2026-02-11 09:16:24');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (25, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 28, 1, 3, 1, '2025-10-04 14:35:00', '2025-08-30 14:35:00');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (26, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 31, 1, 4, 0, '2025-08-05 00:38:25', '2025-07-01 00:38:25');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (27, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 32, 1, 3, 1, '2026-03-22 18:10:52', '2026-02-15 18:10:52');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (28, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 33, 1, 3, 1, '2025-10-25 23:12:34', '2025-09-20 23:12:34');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (29, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 34, 1, 3, 1, '2026-05-07 22:12:52', '2026-04-02 22:12:52');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (30, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 35, 1, 3, 1, '2026-06-17 17:02:43', '2026-05-13 17:02:43');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (31, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 37, 1, 3, 1, '2025-11-18 07:32:03', '2025-10-14 07:32:03');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (32, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 38, 1, 4, 0, '2025-08-20 05:31:29', '2025-07-16 05:31:29');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (33, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 39, 1, 4, 0, '2025-12-30 19:16:14', '2025-11-25 19:16:14');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (34, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 40, 1, 3, 1, '2025-12-15 11:53:57', '2025-11-10 11:53:57');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (35, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 41, 1, 3, 1, '2025-11-25 15:13:53', '2025-10-21 15:13:53');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (36, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 42, 1, 3, 1, '2025-09-27 04:07:37', '2025-08-23 04:07:37');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (37, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 43, 1, 3, 1, '2026-06-20 07:56:58', '2026-05-16 07:56:58');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (38, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 44, 1, 3, 1, '2026-01-19 00:31:01', '2025-12-15 00:31:01');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (39, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 45, 1, 3, 1, '2025-12-09 04:13:27', '2025-11-04 04:13:27');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (40, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 46, 1, 3, 1, '2025-09-22 20:01:40', '2025-08-18 20:01:40');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (41, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 47, 1, 3, 1, '2026-06-25 22:35:16', '2026-05-21 22:35:16');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (42, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 48, 1, 3, 1, '2025-12-15 00:38:14', '2025-11-10 00:38:14');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (43, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 49, 1, 3, 1, '2026-07-26 14:05:28', '2026-06-21 14:05:28');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (44, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 50, 1, 3, 1, '2026-07-09 08:23:10', '2026-06-04 08:23:10');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (45, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 51, 1, 3, 1, '2025-09-02 10:11:41', '2025-07-29 10:11:41');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (46, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 52, 1, 3, 1, '2026-03-28 08:21:45', '2026-02-21 08:21:45');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (47, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 53, 1, 3, 1, '2026-03-08 13:40:12', '2026-02-01 13:40:12');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (48, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 54, 1, 3, 1, '2026-04-23 06:50:06', '2026-03-19 06:50:06');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (49, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 55, 1, 3, 1, '2026-03-06 23:05:26', '2026-01-30 23:05:26');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (50, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 56, 1, 3, 1, '2025-10-10 07:23:03', '2025-09-05 07:23:03');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (51, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 57, 1, 3, 1, '2025-11-14 12:49:44', '2025-10-10 12:49:44');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (52, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 58, 1, 3, 1, '2026-03-28 18:16:59', '2026-02-21 18:16:59');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (53, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 59, 1, 3, 1, '2026-06-30 13:17:35', '2026-05-26 13:17:35');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (54, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 60, 1, 4, 0, '2025-11-12 00:26:04', '2025-10-08 00:26:04');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (55, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 61, 1, 3, 1, '2025-08-12 18:08:09', '2025-07-08 18:08:09');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (56, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 62, 1, 3, 1, '2026-02-06 23:33:09', '2026-01-02 23:33:09');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (57, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 63, 1, 3, 1, '2026-01-03 18:30:39', '2025-11-29 18:30:39');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (58, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 64, 1, 3, 1, '2025-10-06 09:34:45', '2025-09-01 09:34:45');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (59, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 65, 1, 3, 1, '2026-04-06 04:10:25', '2026-03-02 04:10:25');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (60, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 66, 1, 3, 1, '2026-06-07 09:09:31', '2026-05-03 09:09:31');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (61, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 67, 1, 4, 0, '2025-11-13 10:18:41', '2025-10-09 10:18:41');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (62, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 68, 1, 4, 0, '2026-05-26 18:04:12', '2026-04-21 18:04:12');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (63, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 69, 1, 3, 1, '2026-04-07 00:23:32', '2026-03-03 00:23:32');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (64, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 70, 1, 3, 1, '2025-08-13 19:21:22', '2025-07-09 19:21:22');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (65, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 71, 1, 3, 1, '2026-01-12 19:19:19', '2025-12-08 19:19:19');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (66, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 73, 1, 4, 0, '2026-05-02 18:34:20', '2026-03-28 18:34:20');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (67, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 74, 1, 3, 1, '2025-11-23 13:27:51', '2025-10-19 13:27:51');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (68, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 77, 1, 3, 1, '2026-05-10 20:01:55', '2026-04-05 20:01:55');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (69, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 78, 1, 3, 1, '2026-04-18 05:50:34', '2026-03-14 05:50:34');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (70, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 79, 1, 3, 1, '2026-02-04 01:43:22', '2025-12-31 01:43:22');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (71, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 81, 1, 3, 1, '2026-07-13 11:51:30', '2026-06-08 11:51:30');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (72, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 82, 1, 3, 1, '2025-09-22 02:24:11', '2025-08-18 02:24:11');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (73, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 86, 1, 3, 1, '2026-01-14 04:41:45', '2025-12-10 04:41:45');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (74, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 87, 1, 3, 1, '2025-08-07 01:56:06', '2025-07-03 01:56:06');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (75, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 88, 1, 3, 1, '2026-05-13 10:00:48', '2026-04-08 10:00:48');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (76, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 89, 1, 3, 1, '2026-07-23 18:41:11', '2026-06-18 18:41:11');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (77, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 90, 1, 3, 1, '2026-05-30 09:09:25', '2026-04-25 09:09:25');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (78, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 91, 1, 3, 1, '2026-04-08 10:14:08', '2026-03-04 10:14:08');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (79, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 92, 1, 3, 1, '2025-10-30 06:10:51', '2025-09-25 06:10:51');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (80, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 93, 1, 3, 1, '2025-11-12 15:20:23', '2025-10-08 15:20:23');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (81, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 94, 1, 3, 1, '2025-12-09 21:33:27', '2025-11-04 21:33:27');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (82, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 95, 1, 3, 1, '2026-06-24 19:11:18', '2026-05-20 19:11:18');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (83, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 96, 1, 3, 1, '2025-10-08 17:59:34', '2025-09-03 17:59:34');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (84, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 97, 1, 3, 1, '2026-02-02 19:48:23', '2025-12-29 19:48:23');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (85, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 98, 1, 3, 1, '2025-10-11 21:26:57', '2025-09-06 21:26:57');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (86, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 99, 1, 3, 1, '2025-09-22 01:17:54', '2025-08-18 01:17:54');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (87, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 100, 1, 3, 1, '2025-10-13 11:08:38', '2025-09-08 11:08:38');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (88, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 101, 1, 3, 1, '2026-05-31 10:55:11', '2026-04-26 10:55:11');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (89, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 102, 1, 3, 1, '2025-08-21 19:46:35', '2025-07-17 19:46:35');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (90, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 103, 1, 3, 1, '2025-08-27 20:59:54', '2025-07-23 20:59:54');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (91, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 104, 1, 4, 0, '2025-09-25 23:37:21', '2025-08-21 23:37:21');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (92, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 105, 1, 4, 0, '2026-05-14 15:09:06', '2026-04-09 15:09:06');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (93, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 106, 1, 3, 1, '2025-10-02 21:21:50', '2025-08-28 21:21:50');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (94, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 107, 1, 3, 1, '2026-02-06 14:22:16', '2026-01-02 14:22:16');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (95, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 108, 1, 3, 1, '2025-11-11 00:14:25', '2025-10-07 00:14:25');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (96, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 109, 1, 4, 0, '2025-11-10 11:00:32', '2025-10-06 11:00:32');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (97, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 110, 1, 3, 1, '2026-02-19 09:09:59', '2026-01-15 09:09:59');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (98, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 111, 1, 3, 1, '2026-04-03 01:22:39', '2026-02-27 01:22:39');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (99, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 112, 1, 4, 0, '2026-03-01 04:51:49', '2026-01-25 04:51:49');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (100, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 113, 1, 3, 1, '2025-08-20 23:04:16', '2025-07-16 23:04:16');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (101, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 114, 1, 3, 1, '2026-05-23 03:47:47', '2026-04-18 03:47:47');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (102, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 115, 1, 3, 1, '2025-10-14 09:43:34', '2025-09-09 09:43:34');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (103, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 116, 1, 3, 1, '2025-10-06 18:13:00', '2025-09-01 18:13:00');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (104, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 1), 118, 1, 3, 1, '2026-05-23 15:40:13', '2026-04-18 15:40:13');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (105, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 119, 1, 3, 1, '2026-04-10 22:36:45', '2026-03-06 22:36:45');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (106, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 8), 120, 1, 3, 1, '2026-05-17 19:35:58', '2026-04-12 19:35:58');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (107, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 121, 1, 3, 1, '2026-01-21 20:09:12', '2025-12-17 20:09:12');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (108, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 122, 1, 3, 1, '2026-04-03 23:07:37', '2026-02-27 23:07:37');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (109, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 123, 1, 3, 1, '2026-06-20 20:19:11', '2026-05-16 20:19:11');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (110, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 3), 124, 1, 3, 1, '2025-09-14 23:02:47', '2025-08-10 23:02:47');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (111, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 125, 1, 2, 0, '2026-07-03 10:28:55', '2026-05-29 10:28:55');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (112, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 7), 126, 1, 3, 1, '2026-03-22 02:21:22', '2026-02-15 02:21:22');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (113, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 5), 127, 1, 3, 1, '2026-01-03 11:46:20', '2025-11-29 11:46:20');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (114, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 4), 128, 1, 3, 1, '2026-01-22 10:27:32', '2025-12-18 10:27:32');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (115, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 2), 129, 1, 3, 1, '2025-12-27 19:16:31', '2025-11-22 19:16:31');
INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])
VALUES (116, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = 6), 130, 1, 4, 0, '2025-10-26 06:11:58', '2025-09-21 06:11:58');
SET IDENTITY_INSERT [BloodInventoryItems] OFF;

-- Re-enable Constraints
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";

PRINT 'Database seed data insertion completed successfully!';

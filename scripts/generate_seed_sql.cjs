const fs = require('fs');
const path = require('path');

// Target file path
const outputPath = path.join(__dirname, '../seed_data.sql');

// Lib of Arab/Libyan names
const firstNames = [
    'أحمد', 'محمد', 'علي', 'حسن', 'عبد الله', 'محمود', 'مصطفى', 'خالد', 'عمر', 'عبد الرحمن',
    'فاطمة', 'عائشة', 'مريم', 'زينب', 'خديجة', 'سارة', 'ياسمين', 'منى', 'نور', 'هدى',
    'طارق', 'سالم', 'إبراهيم', 'يوسف', 'سليمان', 'صلاح', 'عادل', 'سعيد', 'نبيل', 'جمال',
    'أميرة', 'رانية', 'أسماء', 'وفاء', 'هناء', 'ليلى', 'أمل', 'سلوى', 'حنان', 'ابتسام'
];

const lastNames = [
    'الورفلي', 'الترهوني', 'الغراري', 'الفرجامي', 'الزنتاني', 'المصراتي', 'الشركسي', 'التاجوري',
    'الزوي', 'المجبري', 'العرفي', 'العبيدي', 'الفيتوري', 'الحداد', 'الصادق', 'البوسيفي',
    'القماطي', 'العجيلي', 'الرياني', 'شرف الدين', 'عبد الجليل', 'الشارف', 'الشيباني', 'عمار'
];

const cities = ['غريان', 'طرابلس', 'بنغازي', 'مصراتة', 'الزاوية', 'الخمس', 'سبها', 'طبرق', 'سرت', 'ترهونة'];

const bloodTypes = [1, 2, 3, 4, 5, 6, 7, 8]; // 1:A+, 2:A-, 3:B+, 4:B-, 5:AB+, 6:AB-, 7:O+, 8:O-

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatSqlDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function generateSeedSql() {
    let sql = `SET QUOTED_IDENTIFIER ON;\n`;
    sql += `SET ANSI_NULLS ON;\n\n`;
    sql += `-- ==========================================================\n`;
    sql += `-- BloodConnectHub Database Seed Data Script (SQL Server Version)\n`;
    sql += `-- Generated on: ${new Date().toISOString()}\n`;
    sql += `-- ==========================================================\n\n`;

    sql += `-- Disable Constraints and Delete existing data in reverse order\n`;
    sql += `EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";\n\n`;

    sql += `PRINT 'Deleting existing records...';\n`;
    sql += `DELETE FROM [Notifications];\n`;
    sql += `DELETE FROM [DonationLabReports];\n`;
    sql += `DELETE FROM [DonorMedicalDocuments];\n`;
    sql += `DELETE FROM [BloodDisbursements];\n`;
    sql += `DELETE FROM [BloodInventoryItems];\n`;
    sql += `DELETE FROM [DonorRequestResponses];\n`;
    sql += `DELETE FROM [Donations];\n`;
    sql += `DELETE FROM [BloodRequests];\n`;
    sql += `DELETE FROM [Patients];\n`;
    sql += `DELETE FROM [Donors];\n\n`;

    const startDate = new Date('2025-07-01T00:00:00');
    const endDate = new Date('2026-06-30T23:59:59');

    // 1. Seed Donors
    const donors = [];
    const numDonors = 60;
    sql += `PRINT 'Inserting Donors...';\n`;
    sql += `SET IDENTITY_INSERT [Donors] ON;\n`;
    
    for (let i = 1; i <= numDonors; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const fullName = `${firstName} ${lastName}`;
        const genderVal = firstNames.indexOf(firstName) < 10 ? 1 : 2; // 1: Male, 2: Female
        
        // National ID: unique 12 digits
        const nationalId = '1' + String(getRandomInt(10000000000, 99999999999));
        
        // Phone: 091XXXXXXX or 092XXXXXXX
        const phone = (Math.random() > 0.5 ? '091' : '092') + String(getRandomInt(1000000, 9999999));
        
        const birthDate = formatSqlDate(getRandomDate(new Date('1975-01-01'), new Date('2005-01-01')));
        const bloodTypeId = getRandomItem(bloodTypes);
        const city = getRandomItem(cities);
        const isActive = Math.random() > 0.15 ? 1 : 0; // 85% active
        const approvalStatus = Math.random() > 0.1 ? 3 : 1; // 90% Approved (3), 10% PendingDocuments (1)
        const createdAt = formatSqlDate(getRandomDate(startDate, new Date('2025-09-01')));
        
        donors.push({
            donorId: i,
            fullName,
            gender: genderVal,
            bloodTypeId,
            city,
            isActive
        });

        sql += `INSERT INTO [Donors] ([DonorID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [BloodTypeID], [City], [IsActive], [ApprovalStatus], [CreatedAt])\n`;
        sql += `VALUES (${i}, N'${fullName}', '${nationalId}', ${genderVal}, '${birthDate}', '${phone}', ${bloodTypeId}, N'${city}', ${isActive}, ${approvalStatus}, '${createdAt}');\n`;
    }
    sql += `SET IDENTITY_INSERT [Donors] OFF;\n\n`;

    // 2. Seed Patients
    const patients = [];
    const numPatients = 35;
    sql += `PRINT 'Inserting Patients...';\n`;
    sql += `SET IDENTITY_INSERT [Patients] ON;\n`;

    for (let i = 1; i <= numPatients; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const fullName = `${firstName} ${lastName}`;
        const genderVal = firstNames.indexOf(firstName) < 10 ? 1 : 2; // 1: Male, 2: Female
        const nationalId = '2' + String(getRandomInt(10000000000, 99999999999));
        const phone = (Math.random() > 0.5 ? '091' : '092') + String(getRandomInt(1000000, 9999999));
        const birthDate = formatSqlDate(getRandomDate(new Date('1950-01-01'), new Date('2015-01-01')));
        const bloodTypeId = getRandomItem(bloodTypes);
        const city = getRandomItem(cities);
        const createdAt = formatSqlDate(getRandomDate(startDate, new Date('2025-09-01')));

        patients.push({
            patientId: i,
            fullName,
            bloodTypeId,
            city
        });

        sql += `INSERT INTO [Patients] ([PatientID], [FullName], [NationalID], [Gender], [DateOfBirth], [Phone], [City], [BloodTypeID], [CreatedAt])\n`;
        sql += `VALUES (${i}, N'${fullName}', '${nationalId}', ${genderVal}, '${birthDate}', '${phone}', N'${city}', ${bloodTypeId}, '${createdAt}');\n`;
    }
    sql += `SET IDENTITY_INSERT [Patients] OFF;\n\n`;

    // 3. Seed Blood Requests
    const bloodRequests = [];
    const numRequests = 100;
    sql += `PRINT 'Inserting Blood Requests...';\n`;
    sql += `SET IDENTITY_INSERT [BloodRequests] ON;\n`;

    // Date weights over the year
    for (let i = 1; i <= numRequests; i++) {
        const patient = getRandomItem(patients);
        const bloodTypeId = patient.bloodTypeId; // Usually requested for patient's own blood type
        const quantityNeeded = getRandomItem([1, 2, 2, 3, 4]); // 1 to 4 units
        const urgencyLevel = getRandomInt(1, 3); // 1=Normal, 2=Urgent, 3=Emergency
        
        // Date spread over the 1 year
        const requestDateObj = getRandomDate(startDate, endDate);
        const requestDate = formatSqlDate(requestDateObj);
        
        // Required date: request date + 1 to 3 days
        const requiredDateObj = new Date(requestDateObj.getTime() + getRandomInt(1, 3) * 24 * 60 * 60 * 1000);
        const requiredDate = formatSqlDate(requiredDateObj);
        
        // Status: 1=Pending, 2=Fulfilled, 3=PartiallyFulfilled, 4=Cancelled
        let status = 1; 
        const now = new Date('2026-06-30');
        if (requestDateObj < now) {
            const rand = Math.random();
            if (rand < 0.7) {
                status = 2; // Fulfilled
            } else if (rand < 0.85) {
                status = 3; // PartiallyFulfilled
            } else {
                status = 4; // Cancelled
            }
        }
        
        const quantityFulfilled = status === 2 ? quantityNeeded : (status === 3 ? getRandomInt(1, quantityNeeded - 1) : 0);
        const notes = getRandomItem(['', 'حالة فقر دم حاد', 'عملية جراحية مستعجلة', 'نزيف حاد نتيجة حادث سير', 'حالة ولادة قيصرية']);

        bloodRequests.push({
            requestId: i,
            patientId: patient.patientId,
            bloodTypeId,
            quantityNeeded,
            quantityFulfilled,
            requestDateObj,
            status
        });

        sql += `INSERT INTO [BloodRequests] ([RequestID], [PatientID], [BloodTypeID], [QuantityNeeded], [QuantityFulfilled], [UrgencyLevel], [RequestDate], [RequiredDate], [Status], [Notes], [CreatedAt])\n`;
        sql += `VALUES (${i}, ${patient.patientId}, ${bloodTypeId}, ${quantityNeeded}, ${quantityFulfilled}, ${urgencyLevel}, '${requestDate}', '${requiredDate}', ${status}, ${notes ? `N'${notes}'` : 'NULL'}, '${requestDate}');\n`;
    }
    sql += `SET IDENTITY_INSERT [BloodRequests] OFF;\n\n`;

    // 4. Seed Donations
    const donations = [];
    const numDonations = 130;
    sql += `PRINT 'Inserting Donations...';\n`;
    sql += `SET IDENTITY_INSERT [Donations] ON;\n`;

    for (let i = 1; i <= numDonations; i++) {
        const donor = getRandomItem(donors.filter(d => d.isActive));
        const bloodTypeId = donor.bloodTypeId;
        const donationDateObj = getRandomDate(startDate, endDate);
        const donationDate = formatSqlDate(donationDateObj);
        const quantity = getRandomItem([350, 450, 450, 500]); // in ml
        
        // testResult: 1=Pending, 2=Accepted, 3=Rejected
        let testResult = 2; // Default to Accepted
        const rand = Math.random();
        if (rand < 0.08) {
            testResult = 3; // 8% Rejected (due to test outcomes)
        } else if (rand < 0.12) {
            testResult = 1; // 4% Pending (recent ones)
        }

        const testedAt = testResult !== 1 ? formatSqlDate(new Date(donationDateObj.getTime() + 6 * 60 * 60 * 1000)) : null;
        const isAddedToInventory = testResult === 2 ? 1 : 0;
        const notes = getRandomItem(['', 'تبرع طوعي دوري', 'تبرع عائلي لصالح مريض', 'بصحة جيدة بعد التبرع']);

        donations.push({
            donationId: i,
            donorId: donor.donorId,
            bloodTypeId,
            donationDateObj,
            quantity,
            testResult,
            isAddedToInventory
        });

        sql += `INSERT INTO [Donations] ([DonationID], [DonorID], [BloodTypeID], [DonationDate], [Quantity], [TestResult], [TestedAt], [IsAddedToInventory], [Notes], [CreatedAt])\n`;
        sql += `VALUES (${i}, ${donor.donorId}, ${bloodTypeId}, '${donationDate}', ${quantity}, ${testResult}, ${testedAt ? `'${testedAt}'` : 'NULL'}, ${isAddedToInventory}, ${notes ? `N'${notes}'` : 'NULL'}, '${donationDate}');\n`;
    }
    sql += `SET IDENTITY_INSERT [Donations] OFF;\n\n`;

    // 5. Seed Donor Responses (linking Donors to BloodRequests and their Donations)
    const numResponses = 75;
    sql += `PRINT 'Inserting Donor Responses...';\n`;
    sql += `SET IDENTITY_INSERT [DonorRequestResponses] ON;\n`;

    let responseId = 1;
    for (let i = 0; i < numResponses; i++) {
        const request = getRandomItem(bloodRequests);
        // Find a donor with the same blood type, or compatible blood type (O- is universal donor, O+ compatible with all positive, etc.)
        // For simplicity, let's match exact blood type or O- (ID 8) or O+ (ID 7)
        const compatibleDonors = donors.filter(d => 
            d.bloodTypeId === request.bloodTypeId || 
            d.bloodTypeId === 7 || 
            d.bloodTypeId === 8
        );
        
        if (compatibleDonors.length === 0) continue;
        const donor = getRandomItem(compatibleDonors);
        
        // Response date is around request date + a few hours/days
        const responseDateObj = new Date(request.requestDateObj.getTime() + getRandomInt(1, 48) * 60 * 60 * 1000);
        if (responseDateObj > endDate) continue;
        const responseDate = formatSqlDate(responseDateObj);

        // Status: 1=Interested, 2=Confirmed, 3=Donated, 4=Rejected, 5=NoShow, 6=Cancelled
        let status = 1;
        let donationId = null;
        
        if (request.status === 2) {
            // Find if there is a donation by this donor around that time
            const matchingDonation = donations.find(d => 
                d.donorId === donor.donorId && 
                Math.abs(d.donationDateObj.getTime() - responseDateObj.getTime()) < 5 * 24 * 60 * 60 * 1000
            );
            if (matchingDonation) {
                status = 3; // Donated
                donationId = matchingDonation.donationId;
            } else {
                status = 2; // Confirmed
            }
        } else if (request.status === 4) {
            status = 6; // Cancelled
        } else {
            status = getRandomItem([1, 2]);
        }

        const notes = getRandomItem(['', 'مستعد للحضور فوراً', 'تواصل هاتفي ناجح', 'تم تأكيد الموعد']);

        sql += `INSERT INTO [DonorRequestResponses] ([ResponseID], [DonorID], [RequestID], [Status], [Notes], [DonationID], [ResponseDate], [CreatedAt])\n`;
        sql += `VALUES (${responseId}, ${donor.donorId}, ${request.requestId}, ${status}, ${notes ? `N'${notes}'` : 'NULL'}, ${donationId ?? 'NULL'}, '${responseDate}', '${responseDate}');\n`;
        
        responseId++;
    }
    sql += `SET IDENTITY_INSERT [DonorRequestResponses] OFF;\n\n`;

    // 6. Seed Blood Inventory Items
    sql += `PRINT 'Inserting Blood Inventory Items...';\n`;
    sql += `SET IDENTITY_INSERT [BloodInventoryItems] ON;\n`;

    let itemId = 1;
    for (const donation of donations) {
        if (donation.testResult !== 2) continue; // Only accepted donations go to inventory
        
        // Status: 1=Available, 2=Reserved, 3=Used, 4=Expired
        // Expiry date is 35 days after donation date
        const donationDate = donation.donationDateObj;
        const expiryDateObj = new Date(donationDate.getTime() + 35 * 24 * 60 * 60 * 1000);
        const expiryDate = formatSqlDate(expiryDateObj);
        
        let status = 1; // Available
        const now = new Date('2026-06-30');
        
        if (expiryDateObj < now) {
            // If expired, it's either Used (3) or Expired (4)
            status = Math.random() > 0.2 ? 3 : 4;
        } else {
            // If not expired, it can be Available (1), Reserved (2), or Used (3)
            status = Math.random() > 0.4 ? 3 : (Math.random() > 0.3 ? 1 : 2);
        }

        const isUsed = status === 3 ? 1 : 0;

        sql += `INSERT INTO [BloodInventoryItems] ([InventoryItemID], [InventoryID], [DonationID], [Quantity], [Status], [IsUsed], [ExpiryDate], [AddedAt])\n`;
        sql += `VALUES (${itemId}, (SELECT TOP 1 InventoryID FROM BloodInventories WHERE BloodTypeID = ${donation.bloodTypeId}), ${donation.donationId}, 1, ${status}, ${isUsed}, '${expiryDate}', '${formatSqlDate(donationDate)}');\n`;
        
        itemId++;
    }
    sql += `SET IDENTITY_INSERT [BloodInventoryItems] OFF;\n\n`;

    sql += `-- Re-enable Constraints\n`;
    sql += `EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";\n\n`;
    sql += `PRINT 'Database seed data insertion completed successfully!';\n`;

    fs.writeFileSync(outputPath, '\ufeff' + sql, 'utf8');
    console.log(`Successfully generated seed SQL at: ${outputPath}`);
}

generateSeedSql();

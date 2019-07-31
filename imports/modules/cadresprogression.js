export const NonTeachingCadresAndProgression = () => {
  const cadre = [
    [
      { cadre: "ADMINISTRATIVE OFFICER II", scale: 7 },
      { cadre: "ADMINISTRATIVE OFFICER I", scale: 8 },
      { cadre: "ASSISTANT REGISTRAR", scale: 9 },
      { cadre: "SENIOR ASSISTANT REGISTRAR", scale: 11 },
      { cadre: "PRINCIPAL ASSISTANT REGISTRAR", scale: 13 },
      { cadre: "DEPUTY REGISTRAR", scale: 14 },
      { cadre: "DIRECTOR", scale: 15 }
    ],
    [
      { cadre: "EXECUTIVE OFFICER", scale: 6 },
      { cadre: "HIGHER EXECUTIVE OFFICER", scale: 7 },
      { cadre: "SENIOR EXECUTIVE OFFICER II", scale: 8 },
      { cadre: "SENIOR EXECUTIVE OFFICER I", sclae: 9 },
      { cadre: "PRINCIPAL EXECUTIVE OFFICER II", scale: 11 },
      { cadre: "PRINCIPAL EXECUTIVE OFFICER I", scale: 12 },
      { cadre: "ASSISTANT CHIEF EXECUTIVE OFFICER", scale: 13 },
      { cadre: "CHIEF EXECUTIVE OFFICER", scale: 14 }
    ],

    [
      { cadre: "ACCOUNTANT II", scale: 7 },
      { cadre: "ACCOUNTANT I", scale: 8 },
      { cadre: "SENIOR ACCOUNTANT", scale: 9 },
      { cadre: "PRINCIPAL ACCOUNTANT", scale: 11 },
      { cadre: "CHIEF ACCOUNTANT", scale: 13 },
      { cadre: "DEPUTY BURSAR", scale: 14 },
      { cadre: "DIRECTOR OF ACCOUNTS", scale: 15 }
    ],
    [
      { cadre: "AUDITOR II", scale: 7 },
      { cadre: "AUDITOR I", scale: 8 },
      { cadre: "SENIOR INTERNAL AUDITOR", scale: 9 },
      { cadre: "PRINCIPAL INTERNAL AUDITOR", scale: 11 },
      { cadre: "CHIEF INTERNAL AUDITOR", scale: 13 },
      { cadre: "DEPUTY DIRECTOR AUDITOR", scale: 14 },
      { cadre: "DIRECTOR OF INTERNAL AUDITOR", scale: 15 }
    ],
    [
      { cadre: "EXECUTIVE OFFICER (ACCOUNTS)", scale: 6 },
      { cadre: "HIGHER EXECUTIVE OFFICER (ACCOUNTS)", scale: 7 },
      { cadre: "SENIOR EXECUTIVE OFFICER II (ACCOUNTS)", scale: 8 },
      { cadre: "SENIOR EXECUTIVE OFFICER I (ACCOUNTS)", scale: 9 },
      { cadre: "PRINCIPAL EXECUTIVE OFFICER II (ACCOUNTS)", scale: 11 },
      { cadre: "PRINCIPAL EXECUTIVE OFFICER I (ACCOUNTS)", scale: 12 },
      { cadre: "ASSISTANT CHIEF EXECUTIVE OFFICE (ACCOUNTS)", scale: 13 },
      { cadre: "CHIEF EXECUTIVE OFFICER (ACCOUNTS)", scale: 14 }
    ],

    [
      { cadre: "STORES OFFICER", scale: 6 },
      { cadre: "HIGHER STORES OFFICER", scale: 7 },
      { cadre: "SENIOR STORES OFFICER II", scale: 8 },
      { cadre: "SENIOR STORES OFFICER 1", scale: 9 },
      { cadre: "PRINCIPAL STORES OFFICER II", scale: 11 },
      { cadre: "PRINCIPAL STORES OFFICER I", scale: 12 },
      { cadre: "ASSISTANT CHIEF STORE OFFICER", scale: 13 },
      { cadre: "CHIEF STORES OFFICER", scale: 14 }
    ],

    [
      { cadre: "MEDICAL OFFICER", scale: 9 },
      { cadre: "SENIOR MEDICAL OFFICER", scale: 11 },
      { cadre: "PRINCIPAL MEDICAL OFFICER II", scale: 13 },
      { cadre: "PRINCIPAL MEDICAL OFFICER I", scale: 14 },
      { cadre: "CHIEF MEDICAL OFFICER", scale: 15 }
    ],
    [
      { cadre: "CONSULTANT SPECIAL GRADED II", scale: 14 },
      { cadre: "CONSULTANT SPECIAL GRADE I", scale: 15 },
      { cadre: "PRINCIPAL MEDICAL OFFICER II", scale: 13 },
      { cadre: "PRINCIPAL MEDICAL OFFICER I", scale: 14 },
      { cadre: "CHIEF MEDICAL OFFICER", scale: 15 }
    ],
    [
      { cadre: "INTERN PHARMACIST", scale: 8 },
      { cadre: "PHARMACIST", scale: 9 },
      { cadre: "SENIOR PHARMACIST", scale: 11 },
      { cadre: "PRINCIPAL PHARMACIST", scale: 13 },
      { cadre: "PRINCIPAL PHARMACIST I", scale: 14 },
      { cadre: "CHIEF PHARMACIST", scale: 15 }
    ],
    [
      { cadre: "INTERN PHARMACIST", scale: 8 },
      { cadre: "PHARMACIST", scale: 9 },
      { cadre: "SENIOR PHARMACIST", scale: 11 },
      { cadre: "PRINCIPAL PHARMACIST", scale: 13 },
      { cadre: "PRINCIPAL PHARMACIST I", scale: 14 },
      { cadre: "CHIEF PHARMACIST", scale: 15 }
    ],
    [
      { cadre: "PRINCIPAL PHARMACY ASSISTANT", scale: 6 },
      { cadre: "CHIEF PHARMACY ASSISTANT", scale: 7 },
      { cadre: "PHARMACY SUPERVISOR", scale: 8 }
    ],
    [
      { cadre: "PHARMACY TECHNICIAN II", scale: 6 },
      { cadre: "PHARMACY TECHNICIAN I", scale: 7 },
      { cadre: "SENIOR PHARMACY TECHNICIAN II", scale: 8 },
      { cadre: "SENIOR PHARMACY TECHNICIAN I", scale: 9 },
      { cadre: "PRINCIPAL PHARMACY TECHNICIAN", scale: 11 },
      { cadre: "ASSISTANT CHIEF PHARMACY TECHNICIAN", scale: 12 },
      { cadre: "CHIEF PHARMACY TECHNICIAN", scale: 13 }
    ],
    [
      { cadre: "NURSING OFFICER II", scale: 8 },
      { cadre: "NURSING OFFICER I", scale: 9 },
      { cadre: "SENIOR NURSING OFFICER", scale: 11 },
      { cadre: "PRINCIPAL NURSING OFFICER", scale: 13 },
      { cadre: "ASSISTANT CHIEF NURSING OFFICER", scale: 14 },
      { cadre: "CHIEF NURSING OFFICER", scale: 15 }
    ],
    [
      { cadre: "NURSING SISTER", scale: 7 },
      { cadre: "SENIOR NURSING SISTER", scale: 8 },
      { cadre: "MATRON II", scale: 9 },
      { cadre: "MATRON I", scale: 11 },
      { cadre: "SENIOR MATRON", scale: 12 },
      { cadre: "CHIEF MATRON", scale: 13 },
      { cadre: "SENIOR CHIEF MATRON", scale: 14 }
    ],
    [
      { cadre: "NURSING SUPERINTENDENT", scale: 7 },
      { cadre: "SENIOR NURSING SUPERINTENDENT", scale: 8 },
      { cadre: "PRINCIPAL SUPERINTENDENT II", scale: 9 },
      { cadre: "PRINCIPAL SUPERINTENDENT I", scale: 11 },
      { cadre: "ASSISTANT CHIEF NURSING SUPERINTENDENT", scale: 12 },
      { cadre: "CHIEF NURSING SUPERINTENDENT", scale: 13 },
      { cadre: "SENIOR CHIEF NURSING SUPERINTENDENT", scale: 14 }
    ],
    [
      { cadre: "INTERN MEDICAL LABORATORY SCIENTIST", scale: 8 },
      { cadre: "MEDICAL LABORATORY SCIENTIST", scale: 9 },
      { cadre: "SENIOR MEDICAL LABORATORY SCIENTIST", scale: 11 },
      { cadre: "PRINCIPAL MEDICAL LABORATORY SCIENTIST", scale: 12 },
      { cadre: "CHIEF MEDICAL LABORATORY SCIENTIST", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF MEDICAL LABORATORY SCIENTIST", scale: 14 },
      { cadre: "DIRECTOR (MEDICAL LABORATORY SCIENTIST)", scale: 15 }
    ],
    [
      { cadre: "INTERN RADIOGRAPHER", scale: 8 },
      { cadre: "RADIOGRAPHER", scale: 9 },
      { cadre: "SENIOR RADIOGRAPHER", scale: 11 },
      { cadre: "PRECORDSRINCIPAL RADIOGRAPHER II", scale: 12 },
      { cadre: "PRINCIPAL RADIOGRAPHER I", scale: 13 },
      { cadre: "CHIEF RADIOGRAPHER", scale: 14 },
      { cadre: "UNIVERSITY RADIOGRAPHER", scale: 15 }
    ],
    [
      { cadre: "HEALTH RECORDS OFFICER II", scale: 6 },
      { cadre: "HEALTH RECORDS OFFICER I", scale: 7 },
      { cadre: "SENIOR HEALTH RECORDS OFFICER", scale: 8 },
      { cadre: "PRINCIPAL HEALTH RECORDS OFFICER II", scale: 9 },
      { cadre: "PRINCIPAL HEALTH RECORDS OFFICER I", scale: 11 },
      { cadre: "ASSISTANT CHIEF HEALTH RECORDS OFFICER", scale: 12 },
      { cadre: "CHIEF HEALTH RECORDS OFFICER", scale: 13 },
      { cadre: "SENIOR CHIEF HEALTH RECORDS OFFICER", scale: 14 }
    ],

    [
      { cadre: "MEDICAL LABORATORY TECHNOLOGIST II", scale: 7 },
      { cadre: "MEDICAL LABORATORY TECHNOLOGIST I", scale: 8 },
      { cadre: "SENIOR MEDICAL LABORATORY TECHNOLOGIST", scale: 9 },
      { cadre: "PRINCIPAL MEDICAL LABORATORY TECHNOLOGIST", scale: 11 },
      { cadre: "ASSISTANT CHIEF MEDICAL LABORATORY TECHNOLOGIST", scale: 12 },
      { cadre: "CHIEF MEDICAL LABORATORY TECHNOLOGIST", scale: 13 },
      { cadre: "SENIOR CHIEF MEDICAL LABORATORY TECHNOLOGIST", scale: 14 },
      { cadre: "PRINCIPAL CHIEF MEDICAL LABORATORY TECHNOLOGIST", scale: 15 }
    ],

    [
      { cadre: "HEALTH SUPERINTENDENT II", scale: 6 },
      { cadre: "HEALTH SUPERINTENDENT I", scale: 7 },
      { cadre: "SENIOR HEALTH SUPERINTENDENT", scale: 8 },
      { cadre: "PRINCIPAL HEALTH SUPERINTENDENT", scale: 9 },
      { cadre: "ASSISTANT CHIEF HEALTH SUPERINTENDENT", scale: 11 },
      { cadre: "CHIEF HEALTH SUPERINTENDENT II", scale: 12 },
      { cadre: "CHIEF HEALTH SUPERINTENDENT I", scale: 13 },
      { cadre: "HEALTH ADMINISTRATOR", scale: 14 }
    ],

    [
      { cadre: "HEALTH TECHNICIAN II", scale: 6 },
      { cadre: "HEALTH TECHNICIAN I", scale: 7 },
      { cadre: "HIGHER HEALTH TECHNICIAN", scale: 8 },
      { cadre: "SENIOR HEALTH TECHNICIAN", scale: 9 },
      { cadre: "PRINCIPAL HEALTH TECHNICIAN II", scale: 11 },
      { cadre: "PRINCIPAL HEALTH TECHNICIAN I", scale: 12 },
      { cadre: "ASSISTANT CHIEF HEALTH TECHNICIAN", scale: 13 },
      { cadre: "CHIEF HEALTH TECHNICIAN", scale: 14 }
    ],

    [
      { cadre: "WARD SUPERVISOR", scale: 6 },
      { cadre: "SENIOR WARD SUPERVISOR", scale: 7 },
      { cadre: "WARD SUPERINTENDENT", scale: 8 }
    ],

    [
      { cadre: "ENGINEER II", scale: 7 },
      { cadre: "ENGINEER I", scale: 8 },
      { cadre: "SENIOR ENGINEER", scale: 9 },
      { cadre: "PRINCIPAL ENGINEER", scale: 11 },
      { cadre: "CHIEF ENGINEER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF WORKS", scale: 14 },
      { cadre: "DIRECTOR OF WORKS", scale: 15 }
    ],

    [
      { cadre: "ARCHITECT II", scale: 7 },
      { cadre: "ARCHITECT I", scale: 8 },
      { cadre: "SENIOR ARCHITECT", scale: 9 },
      { cadre: "PRINCIPAL ARCHITECT", scale: 11 },
      { cadre: "CHIEF ARCHITECT", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF PHYSICAL PLANNING", scale: 14 },
      { cadre: "DIRECTOR OF PHYSICAL PLANNING", scale: 15 }
    ],
    [
      { cadre: "TOWN PLANNER II", scale: 7 },
      { cadre: "TOWN PLANNER I", scale: 8 },
      { cadre: "SENIOR TOWN PLANNER", scale: 9 },
      { cadre: "PRINCIPAL TOWN PLANNER", scale: 11 },
      { cadre: "CHIEF TOWN PLANNER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF PHYSICAL PLANNING", scale: 14 },
      { cadre: "DIRECTOR OF PHYSICAL PLANNING", scale: 15 }
    ],
    [
      { cadre: "QUANTITY SURVEYOR II", scale: 7 },
      { cadre: "QUANTITY SURVEYOR I", scale: 8 },
      { cadre: "SENIOR QUANTITY SURVEYOR", scale: 9 },
      { cadre: "PRINCIPAL QUANTITY SURVEYOR", scale: 11 },
      { cadre: "CHIEF QUANTITY SURVEYOR", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF PHYSICAL PLANNING", scale: 14 },
      { cadre: "DIRECTOR OF PHYSICAL PLANNING", scale: 15 }
    ],
    [
      { cadre: "BUILDER II", scale: 7 },
      { cadre: "BUILDER I", scale: 8 },
      { cadre: "SENIOR BUILDER", scale: 9 },
      { cadre: "PRINCIPAL BUILDER", scale: 11 },
      { cadre: "CHIEF BUILDER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF PHYSICAL PLANNING", scale: 14 },
      { cadre: "DIRECTOR OF PHYSICAL PLANNING", scale: 15 }
    ],
    [
      { cadre: "ESTATE VALUER II", scale: 7 },
      { cadre: "ESTATE VALUER I", scale: 8 },
      { cadre: "SENIOR ESTATE VALUER", scale: 9 },
      { cadre: "PRINCIPAL ESTATE VALUER", scale: 11 },
      { cadre: "ESTATE VALUER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF PHYSICAL PLANNING", scale: 14 },
      { cadre: "DIRECTOR OF PHYSICAL PLANNING", scale: 15 }
    ],

    [
      { cadre: "LAND SURVEYOR II", scale: 7 },
      { cadre: "LAND SURVEYOR I", scale: 8 },
      { cadre: "SENIOR LAND SURVEYOR", scale: 9 },
      { cadre: "PRINCIPAL LAND SURVEYOR", scale: 11 },
      { cadre: "LAND SURVEYOR", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF PHYSICAL PLANNING", scale: 14 },
      { cadre: "DIRECTOR OF PHYSICAL PLANNING", scale: 15 }
    ],

    [
      { cadre: "TRANSPORT SUPERVISOR/MECHANIC", scale: 6 },
      { cadre: "HIGHER TRANSPORT SUPERVISOR ", scale: 7 },
      { cadre: "SENIOR TRANSPORT SUPERVISOR", scale: 8 },
      { cadre: "CHIEF TRANSPORT SUPERVISOR", scale: 9 }
    ],

    [
      { cadre: "LABORATORY TECHNICIAN II", scale: 6 },
      { cadre: "LABORATORY TECHNICIAN I", scale: 7 },
      { cadre: "HIGHER LABORATORY TECHNICIAN", scale: 8 },
      { cadre: "SENIOR LABORATORY TECHNICIAN", scale: 9 },
      { cadre: "PRINCIPAL LABORATORY TECHNICIAN", scale: 11 },
      { cadre: "ASSISTANT CHIEF LABORATORY TECHNICIAN", scale: 12 },
      { cadre: "CHIEF LABORATORY TECHNICIAN", scale: 13 }
    ],

    [
      { cadre: "TECHNOLOGIST II", scale: 7 },
      { cadre: "TECHNOLOGIST I", scale: 8 },
      { cadre: "SENIOR TECHNOLOGIST", scale: 9 },
      { cadre: "PRINCIPAL TECHNOLOGIST", scale: 11 },
      { cadre: "ASSISTANT CHIEF TECHNOLOGIST", scale: 12 },
      { cadre: "CHIEF TECHNOLOGIST", scale: 13 },
      { cadre: "SENIOR CHIEF TECHNOLOGIST", scale: 14 },
      { cadre: "PRINCIPAL CHIEF TECHNOLOGIST", scale: 15 }
    ],

    [
      { cadre: "TECHNICAL OFFICER II", scale: 6 },
      { cadre: "TECHNICAL OFFICER I", scale: 7 },
      { cadre: "HIGHER TECHNICAL OFFICER", scale: 8 },
      { cadre: "SENIOR TECHNICAL OFFICER I", scale: 9 },
      { cadre: "PRINCIPAL TECHNICAL OFFICER II", scale: 11 },
      { cadre: "PRINCIPAL TECHNICAL OFFICER I", scale: 12 },
      { cadre: "ASSISTANT CHIEF TECHNICAL OFFICER", scale: 13 },
      { cadre: "CHIEF TECHNICAL OFFICER", scale: 14 }
    ],

    [
      { cadre: "ASSISTANT CURATOR", scale: 6 },
      { cadre: "CURATOR II", scale: 7 },
      { cadre: "CURATOR I", scale: 8 },
      { cadre: "SENIOR CURATOR II", scale: 9 },
      { cadre: "SENIOR CURATOR I", scale: 11 },
      { cadre: "PRINCIPAL CURATOR", scale: 12 },
      { cadre: "ASSISTANT CHIEF CURATOR", scale: 13 },
      { cadre: "CHIEF CURATOR", scale: 14 }
    ],

    [
      { cadre: "FARM OFFICER II", scale: 7 },
      { cadre: "FARM OFFICER I", scale: 8 },
      { cadre: "SENIOR FARM OFFICER", scale: 9 },
      { cadre: "PRINCIPAL FARM OFFICER II", scale: 11 },
      { cadre: "PRINCIPAL FARM OFFICER I", scale: 13 },
      { cadre: "DEPUTY FARM MANAGER", scale: 14 },
      { cadre: "FARM MANAGER", scale: 15 }
    ],

    [
      { cadre: "PRINCIPAL MODEL", scale: 6 },
      { cadre: "ASSISTANT CHIEF MODEL", scale: 7 },
      { cadre: "CHIEF MODEL", scale: 8 }
    ],

    [
      { cadre: "ASSISTANT ARTS FELLOW", scale: 7 },
      { cadre: "ARTS FELLOW II", scale: 8 },
      { cadre: "ARTS FELLOW I", scale: 9 },
      { cadre: "SENIOR ARTS FELLOW II", scale: 11 },
      { cadre: "SENIOR ARTS FELLOW I", scale: 13 },
      { cadre: "PRINCIPAL ARTS FELLOW", scale: 14 },
      { cadre: "CHIEF ARTS FELLOW", scale: 15 }
    ],

    [
      { cadre: "LIBRARY OFFICER", scale: 6 },
      { cadre: "HIGHER LIBRARY OFFICER", scale: 7 },
      { cadre: "SENIOR LIBRARY OFFICER", scale: 8 },
      { cadre: "PRINCIPAL LIBRARY OFFICER II", scale: 9 },
      { cadre: "PRINCIPAL LIBRARY OFFICER I", scale: 11 },
      { cadre: "ASSISTANT CHIEF LIBRARY OFFICER", scale: 12 },
      { cadre: "CHIEF LIBRARY OFFICER", scale: 13 },
      { cadre: "SENIOR CHIEF LIBRARY OFFICER", scale: 14 },
      { cadre: "PRINCIPAL CHIEF LIBRARY OFFICER", scale: 15 }
    ],
    [
      { cadre: "LIBRARY SUPERVISOR", scale: 6 },
      { cadre: "SENIOR LIBRARY SUPERVISOR", scale: 7 },
      { cadre: "PRINCIPAL LIBRARY SUPERVISOR", scale: 8 }
    ],

    [
      { cadre: "BINDERY OFFICER", scale: 6 },
      { cadre: "HIGHER BINDERY OFFICER", scale: 7 },
      { cadre: "SENIOR BINDERY OFFICER", scale: 8 },
      { cadre: "PRINCIPAL BINDERY OFFICER II", scale: 9 },
      { cadre: "PRINCIPAL BINDERY OFFICER I", scale: 11 },
      { cadre: "ASSISTANT CHIEF BINDERY OFFICER", scale: 12 },
      { cadre: "CHIEF BINDERY OFFICER", scale: 13 }
    ],
    [
      { cadre: "FOREMAN BINDERY", scale: 6 },
      { cadre: "HIGHER BINDERY OFFICER", scale: 7 },
      { cadre: "SENIOR BINDERY OFFICER", scale: 8 },
      { cadre: "PRINCIPAL BINDERY OFFICER II", scale: 9 },
      { cadre: "PRINCIPAL BINDERY OFFICER I", scale: 11 },
      { cadre: "ASSISTANT CHIEF BINDERY OFFICER", scale: 12 },
      { cadre: "CHIEF BINDERY OFFICER", scale: 13 }
    ],
    [
      { cadre: "ASSISTANT SUPERINTENDENT BINDERY", scale: 6 },
      { cadre: "HIGHER BINDERY OFFICER", scale: 7 },
      { cadre: "SENIOR BINDERY OFFICER", scale: 8 },
      { cadre: "PRINCIPAL BINDERY OFFICER II", scale: 9 },
      { cadre: "PRINCIPAL BINDERY OFFICER I", scale: 11 },
      { cadre: "ASSISTANT CHIEF BINDERY OFFICER", scale: 12 },
      { cadre: "CHIEF BINDERY OFFICER", scale: 13 }
    ],
    [
      { cadre: "TECHNICAL OFFICE BINDERY", scale: 6 },
      { cadre: "HIGHER BINDERY OFFICER", scale: 7 },
      { cadre: "SENIOR BINDERY OFFICER", scale: 8 },
      { cadre: "PRINCIPAL BINDERY OFFICER II", scale: 9 },
      { cadre: "PRINCIPAL BINDERY OFFICER I", scale: 11 },
      { cadre: "ASSISTANT CHIEF BINDERY OFFICER", scale: 12 },
      { cadre: "CHIEF BINDERY OFFICER", scale: 13 }
    ],
    [
      { cadre: "CONFIDENTIAL SECRETARY GRADE II", scale: 6 },
      { cadre: "CONFIDENTIAL SECRETARY GRADE I", scale: 7 },
      { cadre: "PERSONAL SECRETARY II", scale: 8 },
      { cadre: "PERSONAL SECRETARY I", scale: 9 },
      { cadre: "SENIOR PERSONAL SECRETARY", scale: 11 },
      { cadre: "PRINCIPAL PERSONAL SECRETARY", scale: 12 },
      { cadre: "ASSISTANT CHIEF PERSONAL SECRETARY", scale: 13 },
      { cadre: "CHIEF PERSONAL SECRETARY", scale: 14 }
    ],
    [
      { cadre: "SENIOR SECRETARIAL ASSISTANT II", scale: 6 },
      { cadre: "SENIOR SECRETARIAL ASSISTANT I", scale: 7 },
      { cadre: "CHIEF SECRETARIAL ASSISTANT", scale: 8 }
    ],
    [
      { cadre: "SENIOR COMPUTER OPERATOR", scale: 6 },
      { cadre: "CHIEF COMPUTER OPERATOR I", scale: 7 }
    ],
    [
      { cadre: "DATA PROCESSING OFFICER", scale: 6 },
      { cadre: "HIGHER DATA PROCESSING OFFICER", scale: 7 },
      { cadre: "SENIOR DATA PROCESSING OFFICER", scale: 8 },
      { cadre: "PRINCIPAL DATA PROCESSING OFFICER II", scale: 9 },
      { cadre: "PRINCIPAL DATA PROCESSING OFFICER I", scale: 11 },
      { cadre: "ASSISTANT CHIEF DATA PROCESSING OFFICER", scale: 12 },
      { cadre: "CHIEF DATA PROCESSING OFFICER", scale: 13 }
    ],
    [
      { cadre: "ASSISTANT SECURITY OFFICER", scale: 6 },
      { cadre: "SECURITY OFFICER", scale: 7 },
      { cadre: "SENIOR SECURITY OFFICER", scale: 8 },
      { cadre: "PRINCIPAL SECURITY OFFICER", scale: 9 },
      { cadre: "ASSISTANT CHIEF SECURITY OFFICER II", scale: 11 },
      { cadre: "ASSISTANT CHIEF SECURITY OFFICER I", scale: 12 },
      { cadre: "DEPUTY CHIEF SECURITY OFFICER", scale: 13 },
      { cadre: "CHIEF SECURITY OFFICER", scale: 14 }
    ],
    [
      { cadre: "ASSISTANT COACH", scale: 6 },
      { cadre: "SPORTS COACH II", scale: 7 },
      { cadre: "SPORTS COACH I", scale: 8 },
      { cadre: "SENIOR SPORTS COACH", scale: 9 },
      { cadre: "PRINCIPAL SPORTS COACH", scale: 11 },
      { cadre: "CHIEF SPORTS COACH", scale: 12 },
      { cadre: "DEPUTY DIRECTOR OF SPORTS", scale: 13 },
      { cadre: "DIRECTOR OF SPORTS", scale: 14 }
    ],
    [
      { cadre: "HALL SUPERVISOR", scale: 6 },
      { cadre: "SENIOR HALL SUPERVISOR", scale: 7 },
      { cadre: "HALL SUPERINTENDENT", scale: 8 },
      { cadre: "SENIOR HALL SUPERINTENDENT", scale: 9 },
      { cadre: "PRINCIPAL HALL SUPERINTENDENT", scale: 11 },
      { cadre: "CHIEF HALL SUPERINTENDENT", scale: 12 },
      { cadre: "DEPUTY HALL ADMINISTRATOR", scale: 13 },
      { cadre: "HALL ADMINISTRATOR", scale: 14 }
    ],

    [
      { cadre: "PROGRAMMER II", scale: 7 },
      { cadre: "PROGRAMMER I", scale: 8 },
      { cadre: "SENIOR PROGRAMMER", scale: 9 },
      { cadre: "PRINCIPAL PROGRAMMER", scale: 11 },
      { cadre: "CHIEF PROGRAMMER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR OF ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],

    [
      { cadre: "SYSTEMS ANALYST II", scale: 7 },
      { cadre: "SYSTEMS ANALYST I", scale: 8 },
      { cadre: "SENIOR SYSTEMS ANALYST", scale: 9 },
      { cadre: "PRINCIPAL SYSTEMS ANALYST", scale: 11 },
      { cadre: "CHIEF SYSTEMS ANALYST", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],

    [
      { cadre: "INTERNET ADMINISTRATOR II", scale: 7 },
      { cadre: "INTERNET ADMINISTRATOR I", scale: 8 },
      { cadre: "SENIOR INTERNET ADMINISTRATOR", scale: 9 },
      { cadre: "PRINCIPAL INTERNET ADMINISTRATOR", scale: 11 },
      { cadre: "CHIEF INTERNET ADMINISTRATOR", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],
    [
      { cadre: "WEBMASTER II", scale: 7 },
      { cadre: "WEBMASTER I", scale: 8 },
      { cadre: "SENIOR WEBMASTER", scale: 9 },
      { cadre: "PRINCIPAL WEBMASTER II", scale: 11 },
      { cadre: "CHIEF WEBMASTER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],
    [
      { cadre: "NETWORK ENGINEER II", scale: 7 },
      { cadre: "NETWORK ENGINEER I", scale: 8 },
      { cadre: "SENIOR NETWORK ENGINEER", scale: 9 },
      { cadre: "PRINCIPAL NETWORK ENGINEER", scale: 11 },
      { cadre: "CHIEF NETWORK ENGINEER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],

    [
      { cadre: "DATA BASE ADMINISTRATOR II", scale: 7 },
      { cadre: "DATA BASE ADMINISTRATOR I", scale: 8 },
      { cadre: "SENIOR DATA BASE ADMINISTRATOR", scale: 9 },
      { cadre: "PRINCIPAL DATA BASE ADMINISTRATOR", scale: 11 },
      { cadre: "CHIEF DATA BASE ADMINISTRATOR", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],

    [
      { cadre: "MULTIMEDIA OFFICER II", scale: 7 },
      { cadre: "MULTIMEDIA OFFICER I", scale: 8 },
      { cadre: "SENIOR MULTIMEDIA OFFICER", scale: 9 },
      { cadre: "PRINCIPAL MULTIMEDIA OFFICER", scale: 11 },
      { cadre: "CHIEF MULTIMEDIA OFFICER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],

    [
      { cadre: "SYSTEM ENGINEER II", scale: 7 },
      { cadre: "SYSTEM ENGINEER I", scale: 8 },
      { cadre: "SENIOR SYSTEM ENGINEER", scale: 9 },
      { cadre: "PRINCIPAL SYSTEM ENGINEER", scale: 11 },
      { cadre: "CHIEF SYSTEM ENGINEER", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],

    [
      { cadre: "SERVER ADMINISTRATOR II", scale: 7 },
      { cadre: "SERVER ADMINISTRATOR I", scale: 8 },
      { cadre: "SENIOR SERVER ADMINISTRATOR", scale: 9 },
      { cadre: "PRINCIPAL SERVER ADMINISTRATOR", scale: 11 },
      { cadre: "CHIEF SERVER ADMINISTRATOR", scale: 13 },
      { cadre: "DEPUTY DIRECTOR,ICT", scale: 14 },
      { cadre: "DIRECTOR OF ICT", scale: 15 }
    ],

    [
      { cadre: "PRINCIPAL SYSTEMS TECHNICIAN", scale: 6 },
      { cadre: "SYSTEMS TECHNICAL OFFICER", scale: 7 },
      { cadre: "SYSTEMS HIGHER TECHNICAL OFFICER", scale: 8 },
      { cadre: "SENIOR SYSTEMS TECHNICAL OFFICER", scale: 9 },
      { cadre: "PRINCIPAL SYSTEMS TECHNICAL OFFICER", scale: 11 },
      { cadre: "PRINCIPAL SYSTEMS TECHNICAL OFFICER", scale: 12 },
      { cadre: "ASSISTANT SYSTEMS CHIEF TECHNICAL OFFICER", scale: 13 },
      { cadre: "SYSTEMS CHIEF TECHNICAL OFFICER", scale: 15 }
    ],
    [
      { cadre: "PHOTOGRAPHER", scale: 6 },
      { cadre: "HIGHER PHOTOGRAPHER", scale: 7 },
      { cadre: "SENIOR PHOTOGRAPHER II", scale: 8 },
      { cadre: "SENIOR PHOTOGRAPHER I", scale: 9 },
      { cadre: "PRINCIPAL PHOTOGRAPHER II", scale: 11 },
      { cadre: "PRINCIPAL PHOTOGRAPHER I", scale: 12 },
      { cadre: "ASSISTANT CHIEF PHOTOGRAPHER", scale: 13 },
      { cadre: "CHIEF PHOTOGRAPHER", scale: 14 }
    ],

    [
      { cadre: "CAMERAMAN", scale: 6 },
      { cadre: "HIGHER CAMERAMAN", scale: 7 },
      { cadre: "SENIOR CAMERAMAN II", scale: 8 },
      { cadre: "SENIOR CAMERAMAN I", scale: 9 },
      { cadre: "PRINCIPAL CAMERAMAN II", scale: 11 },
      { cadre: "PRINCIPAL CAMERAMAN I", scale: 12 },
      { cadre: "ASSISTANT CHIEF CAMERAMAN", scale: 13 },
      { cadre: "CHIEF CAMERAMAN", scale: 14 }
    ],

    [
      { cadre: "SUPERVISOR II (RADIO TELEVISION/FILM)", scale: 6 },
      { cadre: "SUPERVISOR I (RADIO/TV/FILM)", scale: 7 },
      { cadre: "SENIOR SUPERVISOR (RADIO/TELEVISION/FILM)", scale: 8 },
      { cadre: "SUPERINTENDENT (RADIO/TELEVISION/FILM)", scale: 9 },
      { cadre: "SENIOR SUPERINTENDENT (RADIO/TELEVISION/FILM)", scale: 11 },
      { cadre: " PRINCIPAL SUPERINTENDENT (RADIO/TELEVISION/FILM)", scale: 12 },
      {
        cadre: "ASSISTANT CHIEF SUPERINTENDENT (RADIO/TELEVISION/FILM)",
        scale: 13
      },
      { cadre: "CHIEF SUPERINTENDENT (RADIO/TELEVISION/FILM)", scale: 14 }
    ],

    [
      { cadre: "CHIEF CLERICAL OFFICER", scale: 6 },
      { cadre: "PRINCIPAL CHIEF CLERICAL OFFICER II", scale: 7 },
      { cadre: "PRINCIPAL CHIEF CLERICAL OFFICER I", scale: 8 }
    ],
    [
      { cadre: "CHIEF STORE KEEPER", scale: 6 },
      { cadre: "STORE SUPERVISOR", scale: 7 },
      { cadre: "STORE SUPERINTENDENT", scale: 8 }
    ],

    [
      { cadre: "ASSISTANT FIRE SUPERINTENDENT", scale: 6 },
      { cadre: "FIRE SUPERINTENDENT", scale: 7 },
      { cadre: "HIGHER FIRE SUPERINTENDENT", scale: 8 },
      { cadre: "SENIOR FIRE SUPERINTENDENT", scale: 9 },
      { cadre: "PRINCIPAL SUPERINTENDENT", scale: 11 },
      { cadre: "ASSISTANT CHIEF FIRE SUPERINTENDENT", scale: 12 },
      { cadre: "CHIEF FIRE SUPERINTENDENT", scale: 13 }
    ],

    [
      { cadre: "ASSISTANT NEWS EDITOR", scale: 7 },
      { cadre: "NEWS EDITOR", scale: 8 },
      { cadre: "SENIOR NEWS EDITOR", scale: 9 },
      { cadre: "PRINCIPAL NEWS EDITOR II", scale: 11 },
      { cadre: "PRINCIPAL NEWS EDITOR I", scale: 12 },
      { cadre: "DEPUTY CHIEF NEWS EDITOR", scale: 13 },
      { cadre: "CHIEF NEWS EDITOR", scale: 14 }
    ],

    [
      { cadre: "ASSISTANT NEWS REPORTER", scale: 7 },
      { cadre: "NEWS EDITOR", scale: 8 },
      { cadre: "SENIOR NEWS EDITOR", scale: 9 },
      { cadre: "PRINCIPAL NEWS EDITOR II", scale: 11 },
      { cadre: "PRINCIPAL NEWS EDITOR I", scale: 12 },
      { cadre: "DEPUTY CHIEF NEWS EDITOR", scale: 13 },
      { cadre: "CHIEF NEWS EDITOR", scale: 14 }
    ],

    [
      { cadre: "TECHNICAL OFFICER (RADIO)", scale: 6 },
      { cadre: "HIGHER TECHNICAL OFFICER (RADIO)", scale: 7 },
      { cadre: "SENIOR TECHNICAL OFFICER II (RADIO)", scale: 8 },
      { cadre: "SENIOR TECHNICAL OFFICER I (RADIO)", scale: 9 },
      { cadre: "PRINCIPAL TECHNICAL OFFICER II (RADIO)", scale: 11 },
      { cadre: "PRINCIPAL TECHNICAL OFFICER I (RADIO)", scale: 12 },
      { cadre: "ASSISTANT CHIEF TECHNICAL OFFICER (RADIO)", scale: 13 },
      { cadre: "CHIEF TECHNICAL OFFICER (RADIO)", scale: 14 }
    ],

    [
      { cadre: "ASSISTANT STUDIO MANAGER", scale: 6 },
      { cadre: "STUDIO MANAGER II", scale: 7 },
      { cadre: "STUDIO MANAGER I", scale: 8 },
      { cadre: "SENIOR STUDIO MANAGER", scale: 9 },
      { cadre: "PRINCIPAL STUDIO MANAGER II", scale: 11 },
      { cadre: "PRINCIPAL STUDIO MANAGER I", scale: 12 },
      { cadre: "DEPUTY CHIEF STUDIO MANAGER", scale: 13 },
      { cadre: "CHIEF STUDIO MANAGER", scale: 14 }
    ],

    [
      { cadre: "PRODUCTION MANAGER II", scale: 7 },
      { cadre: "PRODUCTION MANAGER I", scale: 8 },
      { cadre: "SENIOR PRODUCTION MANAGER", scale: 9 },
      { cadre: "PRINCIPAL PRODUCTION MANAGER II", scale: 11 },
      { cadre: "PRINCIPAL PRODUCTION MANAGER I", scale: 12 },
      { cadre: "DEPUTY CHIEF PRODUCTION MANAGER", scale: 13 },
      { cadre: "CHIEF PRODUCTION MANAGER", scale: 14 }
    ],

    [
      { cadre: "ASSISTANT PRESENTER", scale: 6 },
      { cadre: "PRESENTER II", scale: 7 },
      { cadre: "PRESENTER I", scale: 8 },
      { cadre: "SENIOR PRESENTER", scale: 9 },
      { cadre: "PRINCIPAL PRESENTER II", scale: 11 },
      { cadre: "PRINCIPAL PRESENTER I", scale: 12 },
      { cadre: "DEPUTY CHIEF PRESENTER", scale: 13 },
      { cadre: "CHIEF PRESENTER", scale: 14 }
    ],

    [
      { cadre: "STATION LIBRARIAN II", scale: 7 },
      { cadre: "STATION LIBRARIAN I", scale: 8 },
      { cadre: "SENIOR STATION LIBRARIAN", scale: 9 },
      { cadre: "PRINCIPAL STATION LIBRARIAN II", scale: 11 },
      { cadre: "PRINCIPAL STATION LIBRARIAN I", scale: 12 },
      { cadre: "ASSISTANT CHIEF STATION LIBRARIAN", scale: 13 },
      { cadre: "CHIEF STATION LIBRARIAN", scale: 14 }
    ],
    [
      { cadre: "BROADCAST ENGINEER II", scale: 7 },
      { cadre: "BROADCAST ENGINEER I", scale: 8 },
      { cadre: "SENIOR BROADCAST ENGINEER", scale: 9 },
      { cadre: "PRINCIPAL BROADCAST ENGINEER II", scale: 11 },
      { cadre: "PRINCIPAL BROADCAST ENGINEER I", scale: 12 },
      { cadre: "DEPUTY CHIEF BROADCAST ENGINEER", scale: 13 },
      { cadre: "CHIEF BROADCAST ENGINEER ", scale: 14 }
    ],
    [
      { cadre: "MARKETING OFFICER II", scale: 7 },
      { cadre: "MARKETING OFFICER I", scale: 8 },
      { cadre: "SENIOR MARKETING OFFICER", scale: 9 },
      { cadre: "PRINCIPAL MARKETING OFFICER II", scale: 11 },
      { cadre: "PRINCIPAL MARKETING OFFICER I", scale: 12 },
      { cadre: "DEPUTY CHIEF MARKETING OFFICER", scale: 13 },
      { cadre: "CHIEF MARKETING OFFICER", scale: 14 }
    ]
  ];
  return cadre;
};

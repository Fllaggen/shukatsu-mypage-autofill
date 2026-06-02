(() => {
  if (window.__shukatsuAutofillInstalled) return;
  window.__shukatsuAutofillInstalled = true;

  const PREFECTURES = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県",
    "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
    "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
    "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
    "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];

  const FIELD_ALIASES = {
    fullName: ["fullname", "full_name", "yourname", "username", "applicantname", "氏名", "お名前"],
    fullNameKana: ["fullnamekana", "full_name_kana", "furigana", "phonetic", "氏名カナ", "フリガナ", "ふりがな"],
    lastName: ["kname1", "tbx_name1", "roma_sei", "kanji_sei", "sei", "familyname", "family-name", "lastname", "last-name", "surname", "name1", "氏名姓", "漢字氏名姓", "姓"],
    firstName: ["kname2", "tbx_name2", "roma_na", "kanji_na", "mei", "givenname", "given-name", "firstname", "first-name", "name2", "氏名名", "漢字氏名名", "名"],
    lastNameKana: ["yname1", "tbx_kana1", "kana1", "kanasei", "furiganasei", "furigana_sei", "lastkana", "last_kana", "フリガナ姓", "カナ氏名姓", "セイ"],
    firstNameKana: ["yname2", "tbx_kana2", "kana2", "kanamei", "furiganamei", "furigana_mei", "firstkana", "first_kana", "フリガナ名", "カナ氏名名", "メイ"],
    email: ["tbx_mail", "email", "mail", "mailaddress", "mail_address", "e-mail", "account1", "domain1", "メインメール", "メールアドレス"],
    emailConfirm: ["tbx_mail_r", "email_confirm", "emailconfirmation", "mail_confirm", "mailconfirmation", "account2", "domain2", "再入力", "確認用メール"],
    subEmail: ["tbx_smail", "account3", "domain3", "サブメール"],
    subEmailConfirm: ["tbx_smail_r", "account4", "domain4"],
    birthYear: ["ybirth", "ddl_birthy", "birth_y", "birthyear", "birth_year", "birthdayyear", "生年月日年", "誕生年"],
    birthMonth: ["mbirth", "ddl_birthm", "birth_m", "birthmonth", "birth_month", "birthdaymonth", "生年月日月", "誕生月"],
    birthDay: ["dbirth", "ddl_birthd", "birth_d", "birthday", "birth_day", "birthdayday", "生年月日日", "誕生日"],
    gender: ["sexcd", "rbt_sex", "gender", "sex", "性別"],
    postalCode: ["postalcode", "postal-code", "zipcode", "zip-code", "zip", "郵便番号"],
    postal1: ["gyubin1", "tbx_zip1", "yubing_h", "zip1", "postal1", "postalcode1", "郵便番号前"],
    postal2: ["gyubin2", "tbx_zip2", "yubing_l", "zip2", "postal2", "postalcode2", "郵便番号後"],
    prefecture: ["gken", "ddl_ken", "pref", "prefecture", "address-level1", "都道府県"],
    fullAddress: ["fulladdress", "address", "street-address", "住所"],
    address1: ["gadrs1", "tbx_addr1", "addr1", "address1", "address-line1", "市区郡番地", "市区町村", "番地"],
    address2: ["gadrs2", "tbx_addr2", "addr2", "address2", "address-line2", "マンション", "建物名", "部屋番号"],
    phone: ["tel", "telephone", "phone", "phonenumber", "phone-number", "電話番号", "連絡先電話番号"],
    homeTel1: ["gtel1", "tbx_tel11", "tel1", "phone1", "電話番号前"],
    homeTel2: ["gtel2", "tbx_tel12", "tel2"],
    homeTel3: ["gtel3", "tbx_tel13", "tel3"],
    mobilePhone: ["mobile", "mobilephone", "mobile-phone", "cellphone", "携帯電話番号", "携帯番号", "携帯"],
    mobileTel1: ["kttel1", "tbx_keitai1", "keitai_h", "mobile1", "携帯番号前"],
    mobileTel2: ["kttel2", "tbx_keitai2", "keitai_m", "mobile2"],
    mobileTel3: ["kttel3", "tbx_keitai3", "keitai_l", "mobile3"],
    holidaySame: ["adch", "cbx_kflg", "現住所と同じ", "チェックしてください"],
    gradYear: ["syear", "ddl_sotsuyy", "graduationyear", "graduation_year", "gradyear", "卒業年月年", "卒業年", "卒業予定年"],
    gradMonth: ["smonth", "ddl_sotsuym", "graduationmonth", "graduation_month", "gradmonth", "卒業年月月", "卒業月", "卒業予定月"],
    gradStatus: ["shikbn", "ddl_sotsuk", "graduationstatus", "卒業区分", "卒業予定", "卒業見込み"],
    schoolName: ["school", "schoolname", "school_name", "gakkou", "university", "college", "大学名", "学校名"],
    faculty: ["faculty", "facultyname", "gakubu", "学部", "研究科"],
    department: ["department", "major", "gakka", "course", "学科", "専攻", "コース"],
    schoolType: ["schooltype", "school_type", "学校区分", "学校種別", "学校分類"],
    schoolStartYear: ["schoolstartyear", "enrollmentstartyear", "入学年", "在籍開始年", "在籍期間年"],
    schoolStartMonth: ["schoolstartmonth", "enrollmentstartmonth", "入学月", "在籍開始月", "在籍期間月"],
    schoolEndYear: ["schoolendyear", "enrollmentendyear", "卒業予定年", "在籍終了年"],
    schoolEndMonth: ["schoolendmonth", "enrollmentendmonth", "卒業予定月", "在籍終了月"],
    degree: ["degree", "学位", "課程", "取得学位"],
    degreeYear: ["degreeyear", "degree_year", "取得年月年", "取得年"],
    degreeMonth: ["degreemonth", "degree_month", "取得年月月", "取得月"],
    humanitiesScience: ["bunri", "humanities", "science", "文理", "文理区分", "文系理系"],
    seminar: ["seminar", "lab", "laboratory", "ゼミ", "研究室", "所属ゼミ", "所属研究室"],
    researchTheme: ["researchtheme", "research_theme", "research", "研究テーマ", "研究内容", "卒論", "論文"],
    club: ["club", "circle", "activity", "部活", "部活動", "クラブ", "サークル", "所属団体"],
    qualification: ["qualification", "license", "certificate", "資格", "保有資格", "免許"],
    driverLicense: ["driverlicense", "drivinglicense", "運転免許", "普通免許", "免許の有無"],
    toeic: ["toeic", "toefl", "ielts", "英語資格", "語学", "英語スコア"],
    desiredJob: ["desiredjob", "desired_job", "jobtype", "職種希望", "希望職種", "志望職種", "興味のあるお仕事", "興味のある仕事"],
    desiredLocation: ["desiredlocation", "desired_location", "希望勤務地", "勤務地希望", "志望勤務地"],
    companyCriteria: ["companycriteria", "selectioncriteria", "企業選び", "就職活動の軸", "重視すること", "会社選び", "魅力に感じる"],
    interestedEvents: ["interestedevents", "eventchoice", "参加希望イベント", "希望イベント", "インターンシップ", "説明会", "セミナー"],
    eventDate: ["eventdate", "event_date", "参加希望日", "希望日程", "説明会日程", "イベント日程", "別日程"],
    requestNote: ["requestnote", "request", "希望記入欄", "希望欄", "備考", "連絡希望", "連絡事項"],
    termsConsent: ["terms", "agreement", "agree", "kiyaku", "規約", "利用条件", "同意する"],
    privacyConsent: ["privacy", "personalinfo", "personal_information", "個人情報", "プライバシー", "取り扱い"],
    nationality: ["nationality", "country", "国籍"],
    residenceStatus: ["residencestatus", "residence_status", "visa", "statusofresidence", "在留資格", "在留"],
    workAuthorization: ["workauthorization", "work_authorization", "就労資格", "就労可否", "就労可能"],
    studyAbroad: ["studyabroad", "overseas", "留学", "海外経験", "海外"],
    disabilityStatus: ["disability", "障がい", "障害", "配慮事項"],
    employmentHistory: ["employmenthistory", "workhistory", "jobhistory", "職歴", "勤務先", "アルバイト"],
    noAnswer: ["該当なし", "なし", "特になし"],
    motivation: ["motivation", "message", "志望動機", "志望理由", "応募理由", "入社理由", "応募先へのメッセージ", "メッセージ"],
    selfPr: ["selfpr", "自己pr", "自己PR", "自己ピーアール", "自己アピール"],
    studentEffort: ["gakuchika", "学生時代に力を入れたこと", "学生時代", "力を入れたこと", "打ち込んだこと", "取り組んだこと"],
    studyDetail: ["studydetail", "academic", "学業で取り組んだこと", "学業への取り組み", "研究内容", "専攻内容", "学修内容", "学習内容", "卒業研究", "研究概要"],
    strengths: ["strength", "strongpoint", "強み", "長所", "得意なこと"],
    weakness: ["weakness", "weakpoint", "弱み", "短所", "苦手なこと"],
    careerVision: ["careervision", "futurevision", "将来像", "将来の夢", "将来やりたいこと", "キャリアビジョン", "今後の目標", "入社後に実現したいこと"],
    jobReason: ["jobreason", "occupationreason", "職種志望理由", "希望職種の理由", "職種を希望する理由", "希望する理由"],
    industryInterest: ["industryinterest", "businessinterest", "業界に興味", "事業に興味", "興味を持った理由", "関心を持った理由", "業界志望理由"],
    workValues: ["workvalues", "jobaxis", "就活の軸", "仕事選びの軸", "大切にしたいこと", "働く上で大切", "価値観"],
    challengeExperience: ["challengeexperience", "challenge", "挑戦した経験", "チャレンジした経験", "困難に挑戦", "挑戦したこと"],
    failureExperience: ["failureexperience", "failure", "setback", "失敗経験", "挫折経験", "失敗から学んだこと", "挫折から学んだこと", "困難を乗り越えた経験"],
    teamworkExperience: ["teamworkexperience", "teamwork", "チームで取り組んだ", "チーム経験", "協働経験", "周囲と協力"],
    leadershipExperience: ["leadershipexperience", "leadership", "リーダーシップ", "リーダー経験", "周囲を巻き込んだ経験"],
    achievement: ["achievement", "成果", "実績", "表彰", "受賞", "達成したこと"],
    languageSkills: ["languageskills", "language", "語学スキル", "語学力", "英語力", "外国語"],
    programmingSkills: ["programmingskills", "itskills", "pcskills", "ITスキル", "PCスキル", "プログラミング", "使用できるツール"],
    portfolioUrl: ["portfoliourl", "portfolio", "website", "github", "ポートフォリオ", "制作物", "成果物URL", "githuburl"],
    howKnowCompany: ["howknow", "きっかけ", "キッカケ", "知ったきっかけ", "知ったキッカケ", "何で知った", "媒体", "就職サイト", "ナビサイト"],
    internshipExperience: ["internship", "event", "説明会", "インターン", "イベント", "参加したこと"],
    loginId: ["loginid", "userid", "user_id", "accountid", "account_id", "ログインid", "ログインID", "マイページid", "マイページID"],
    verificationCode: ["verificationcode", "authcode", "onetimecode", "one-time-code", "確認コード", "認証コード", "6桁の半角数字"],
    password: ["password", "passwd", "pass", "pw", "newpassword", "パスワード"],
    foreignAddress: ["foreignaddress", "overseasaddress", "kaigaig", "日本国外の場合", "海外住所", "国外住所"],
    referralDetail: ["referraldetail", "referral_detail", "紹介者", "紹介者名", "その他詳細", "その他を選択", "社員からの紹介", "教授からの紹介"],
    employmentBrand: ["employmentbrand", "workbrand", "勤務ブランド", "勤務経験ブランド", "勤務先ブランド", "ブランド勤務経験", "ユニクロ", "ジーユー", "プラステ"],
    employmentStore: ["employmentstore", "storename", "store_name", "勤務店舗", "店舗名", "勤務先店舗"],
    employeeNumber: ["employeenumber", "employeeid", "employee_id", "staffid", "staff_id", "社員番号", "従業員番号", "スタッフ番号"],
    employmentStartYear: ["employmentstartyear", "workstartyear", "勤務開始年", "入社年", "勤務開始年月年"],
    employmentStartMonth: ["employmentstartmonth", "workstartmonth", "勤務開始月", "入社月", "勤務開始年月月"],
    employmentDuration: ["employmentduration", "workduration", "勤務期間", "アルバイト期間"],
    relocationConsent: ["relocationconsent", "relocation", "transferconsent", "転勤可能", "転勤する可能性", "転勤に同意", "転勤を理解"]
  };

  const AUTOCOMPLETE_FIELDS = {
    "name": "fullName",
    "family-name": "lastName",
    "given-name": "firstName",
    "email": "email",
    "postal-code": "postalCode",
    "address-level1": "prefecture",
    "address-line1": "address1",
    "address-line2": "address2",
    "street-address": "fullAddress",
    "tel": "phone",
    "tel-national": "phone",
    "tel-area-code": "homeTel1",
    "tel-local-prefix": "homeTel2",
    "tel-local-suffix": "homeTel3",
    "bday-year": "birthYear",
    "bday-month": "birthMonth",
    "bday-day": "birthDay",
    "new-password": "password"
  };

  const PLATFORM_RULES = [
    {
      label: "i-web / i-webs",
      host: /(^|\.)i-webs\.jp$|(^|\.)i-web\.jpn\.com$|(^|\.)i-note\.jp$/i,
      hint: /i-?web|i-webs/i
    },
    {
      label: "sonar ATS / SNAR",
      host: /(^|\.)snar\.jp$|(^|\.)sonar-ats\.jp$/i,
      hint: /snar|sonar|jobboard/i
    },
    {
      label: "AOL / アクセスオンライン",
      host: /access[-_]?online|access[-_]?on[-_]?line|aol|axol/i,
      hint: /access[-_]?online|aol|axol/i
    },
    {
      label: "e2R pro",
      host: /e2r|e2rpro|worksjapan/i,
      hint: /e2r|e2rpro/i
    },
    {
      label: "JobSuite FRESHERS",
      host: /jobsuite|job-suite|freshers/i,
      hint: /jobsuite|job-suite|freshers/i
    },
    {
      label: "HITO-Link 新卒",
      host: /hito-link|hitolink/i,
      hint: /hito-link|hitolink/i
    },
    {
      label: "HRMOS採用 新卒版",
      host: /(^|\.)hrmos\.co$|hrmos/i,
      hint: /hrmos/i
    },
    {
      label: "My CareerBox / OpenES",
      host: /(^|\.)mcbox\.mynavi\.jp$|(^|\.)mcid\.mynavi\.jp$|mycareerbox|openes/i,
      hint: /mycareerbox|mcbox|mcid|openes|profile|resume|submission/i
    }
  ];

  const PLATFORM_ENTRY_HINT = /mycareerbox|mcbox|mcid|openes|e2r|e2rpro|jobsuite|job-suite|freshers|hitolink|hito-link|hrmos|sonar|snar|accessonline|access-online|aol|axol/i;
  const HIGHLIGHT_STYLE_ID = "shukatsu-autofill-highlight-style";
  const HIGHLIGHT_ATTR = "data-shukatsu-autofill-highlight";

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/\s+/g, "")
      .replace(/[＊*◆：:・_\-$]/g, "");
  }

  function splitEmail(email = "") {
    const [account = "", domain = ""] = String(email).split("@");
    return { account, domain };
  }

  function splitPhone(phone = "") {
    const raw = String(phone).trim();
    if (!raw) return ["", "", ""];
    const dashed = raw.split("-").filter(Boolean);
    if (dashed.length >= 3) return dashed.slice(0, 3);
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 11) return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7)];
    if (digits.length === 10) return [digits.slice(0, 2), digits.slice(2, 6), digits.slice(6)];
    return [digits, "", ""];
  }

  function splitPostal(postalCode = "") {
    const digits = String(postalCode).replace(/\D/g, "");
    return [digits.slice(0, 3), digits.slice(3, 7)];
  }

  function two(value) {
    const s = String(value || "").replace(/\D/g, "");
    return s.length === 1 ? `0${s}` : s;
  }

  function choiceTokens(value) {
    return String(value || "")
      .split(/[,、\n/／・;；\s]+/)
      .map((item) => normalize(item))
      .filter(Boolean);
  }

  function customAnswerMap(profile) {
    const lines = String(profile.customAnswers || "").split(/\r?\n/);
    return lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return null;
        const index = trimmed.search(/[=:：＝]/);
        if (index < 0) return null;
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim();
        if (!key || !value) return null;
        return { key, normalizedKey: normalize(key), value };
      })
      .filter(Boolean)
      .sort((a, b) => b.normalizedKey.length - a.normalizedKey.length);
  }

  function customAnswerFor(el, customAnswers) {
    if (!customAnswers.length) return "";
    const ctx = `${fieldContext(el)} ${normalize(optionLabel(el))}`;
    const found = customAnswers.find((item) => item.normalizedKey.length >= 2 && ctx.includes(item.normalizedKey));
    return found?.value || "";
  }

  function optionMatches(raw, wanted, field = "") {
    const option = normalize(raw);
    const value = normalize(wanted);
    const tokens = choiceTokens(wanted);
    if (!option || /選択|未選択|指定なし|choose|select/.test(option)) return false;
    if (option === value || tokens.includes(option)) return true;
    if ((value === "true" || value === "yes" || value === "同意" || value === "同意する") && /同意|承諾|確認|agree|accept|はい|yes/.test(option)) return true;
    if ((value === "true" || value === "yes" || value === "有" || value === "あり") && /有|あり|はい|yes|〇|○/.test(option)) return true;
    if ((value === "false" || value === "no" || value === "なし" || value === "無") && /なし|無|いいえ|no|該当なし|経験なし|×/.test(option)) return true;
    if (field === "gradStatus" && /卒業|予定|見込み|修了/.test(value) && /はい|yes|卒業予定|見込み|卒業見込み/.test(option)) return true;
    if (field === "gradStatus" && value.includes("卒業") && option.includes("卒業予定")) return true;
    if (field === "gradStatus" && value.includes("修了") && option.includes("修了予定")) return true;
    if (field === "schoolType" && value.includes("大学") && /大学|学部/.test(option)) return true;
    if (field === "humanitiesScience" && /文系|人文|社会|経済|商|法/.test(value) && /文系|文学|人文|社会|経済|経営|管理|商|法/.test(option)) return true;
    if (field === "humanitiesScience" && /理系|理工|工学|情報|自然科学/.test(value) && /理系|理工|工学|情報|自然科学/.test(option)) return true;
    if ((field === "qualification" || field === "driverLicense") && /有|あり|免許|資格|toeic|toefl|ielts/.test(value) && /有|あり|保有|取得|はい|yes/.test(option)) return true;
    if ((field === "qualification" || field === "driverLicense") && /有|あり|免許|資格|toeic|toefl|ielts/.test(value) && /〇|○/.test(option)) return true;
    if ((field === "relocationConsent" || field === "workAuthorization") && /はい|可能|可|理解|同意|yes/.test(value) && /はい|可能|可|理解|同意|yes/.test(option)) return true;
    if ((field === "gender" || field === "driverLicense" || field === "humanitiesScience") && tokens.some((token) => option.includes(token) || token.includes(option))) return true;
    if (value.length >= 2 && (option.includes(value) || value.includes(option))) return true;
    return tokens.some((token) => token.length >= 2 && (option.includes(token) || token.includes(option)));
  }

  function numericOptions(select) {
    return Array.from(select.options)
      .map((option) => String(option.value || option.text || "").replace(/\D/g, ""))
      .filter(Boolean)
      .map(Number);
  }

  function selectNumberKind(select) {
    const nums = numericOptions(select);
    if (!nums.length) return "";
    const max = Math.max(...nums);
    const min = Math.min(...nums);
    if (max >= 1900 && min >= 1900) return "year";
    if (min >= 1 && max <= 12) return "month";
    if (min >= 1 && max <= 31) return "day";
    return "";
  }

  function fieldContext(el) {
    const id = el.id ? CSS.escape(el.id) : "";
    const explicit = id ? document.querySelector(`label[for="${id}"]`)?.innerText || "" : "";
    const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || "";
    const title = el.getAttribute("title") || "";
    const dataText = Array.from(el.attributes)
      .filter((attr) => attr.name.startsWith("data-"))
      .map((attr) => attr.value)
      .join(" ");
    const parentLabel = el.closest("label")?.innerText || "";
    const container = el.closest("tr, li, .formbox, .formBox, .form_box, .formItem, .formSet, .inputBox, .field, .field-row, .form-group, .form-control-wrap, dl, dd, section");
    const parentText = el.parentElement?.innerText || "";
    const grandParentText = el.parentElement?.parentElement?.innerText || "";
    const dt = el.closest("dd")?.previousElementSibling?.innerText || "";
    const th = el.closest("td")?.previousElementSibling?.innerText || el.closest("tr")?.querySelector("th")?.innerText || "";
    const heading = el.closest("dl, section, form")?.querySelector("h1,h2,h3,.heading_l2,.h3")?.innerText || "";
    return normalize([
      el.name,
      el.id,
      el.placeholder,
      el.autocomplete,
      aria,
      title,
      dataText,
      explicit,
      parentLabel,
      dt,
      th,
      heading,
      container?.innerText || "",
      parentText.length < 140 ? parentText : "",
      grandParentText.length < 180 ? grandParentText : ""
    ].join(" "));
  }

  function fieldLabel(el) {
    const id = el.id ? CSS.escape(el.id) : "";
    const explicit = id ? document.querySelector(`label[for="${id}"]`)?.innerText || "" : "";
    const label = el.closest("label")?.innerText || "";
    const dt = el.closest("dd")?.previousElementSibling?.innerText || "";
    const th = el.closest("td")?.previousElementSibling?.innerText || el.closest("tr")?.querySelector("th")?.innerText || "";
    const placeholder = el.placeholder || "";
    const name = el.name || el.id || "";
    return [name, placeholder, explicit, label, dt, th]
      .filter(Boolean)
      .join(" / ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
  }

  function textNodeValue(node) {
    return node && node.nodeType === Node.TEXT_NODE ? node.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function adjacentText(el, direction) {
    const chunks = [];
    let node = direction === "next" ? el.nextSibling : el.previousSibling;
    while (node && chunks.join(" ").length < 80) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = textNodeValue(node);
        if (text) chunks.push(text);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName;
        if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(tag)) break;
        const text = (node.innerText || node.textContent || "").replace(/\s+/g, " ").trim();
        if (text) chunks.push(text);
      }
      node = direction === "next" ? node.nextSibling : node.previousSibling;
    }
    return chunks.join(" ").trim();
  }

  function optionLabel(el) {
    const id = el.id ? CSS.escape(el.id) : "";
    const explicit = id ? document.querySelector(`label[for="${id}"]`)?.innerText || "" : "";
    const label = el.closest("label")?.innerText || "";
    const aria = el.getAttribute("aria-label") || "";
    const next = adjacentText(el, "next");
    const prev = adjacentText(el, "previous");
    const parentText = el.parentElement?.innerText || "";
    const compactParent = parentText.length <= 90 ? parentText : "";
    const type = String(el.type || "").toLowerCase();
    const optionValue = ["checkbox", "radio"].includes(type) ? el.value : "";
    return [optionValue, el.id, explicit, label, aria, next, prev, compactParent]
      .filter(Boolean)
      .join(" / ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);
  }

  function debugLabel(el) {
    const label = fieldLabel(el);
    const option = optionLabel(el);
    return [label, option && option !== label ? option : ""]
      .filter(Boolean)
      .join(" / ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);
  }

  function fieldInfo(el) {
    return {
      field: detectField(el),
      name: el.name || el.id,
      label: debugLabel(el),
      type: el.type || el.tagName.toLowerCase()
    };
  }

  function isRequiredField(el) {
    const ctx = `${fieldLabel(el)} ${fieldContext(el)}`;
    return Boolean(el.required || el.getAttribute("aria-required") === "true" || /必須|required/.test(ctx));
  }

  function hasFieldValue(el) {
    const type = String(el.type || "").toLowerCase();
    if (type === "checkbox" || type === "radio") {
      const name = el.name;
      if (name) return Array.from(document.querySelectorAll(`input[type="${type}"][name="${CSS.escape(name)}"]`)).some((item) => item.checked);
      return el.checked;
    }
    if (el.tagName === "SELECT") {
      const selected = el.options[el.selectedIndex];
      return Boolean(el.value && selected && !/選択|未選択|指定なし|choose|select/.test(normalize(selected.text || selected.value)));
    }
    return Boolean(String(el.value || "").trim());
  }

  function requiredChoiceGroupKey(el) {
    const type = String(el.type || "").toLowerCase();
    const rowText = (el.closest("tr, fieldset, [role=group], .form-group, .field, .field-row, .inputBox, .formItem, section")?.innerText || "")
      .replace(/\s+/g, " ")
      .trim();
    return [
      type,
      detectField(el) || "unknown",
      normalize(rowText).slice(0, 140) || fieldCaption(el) || el.name || debugLabel(el)
    ].join(":");
  }

  function emptyRequiredFields() {
    const missing = [];
    const choiceGroups = new Map();

    for (const el of getFillableFields()) {
      if (!isRequiredField(el)) continue;
      const type = String(el.type || "").toLowerCase();
      if (type === "checkbox" || type === "radio") {
        const key = requiredChoiceGroupKey(el);
        const group = choiceGroups.get(key) || [];
        group.push(el);
        choiceGroups.set(key, group);
      } else if (!hasFieldValue(el)) {
        missing.push(fieldInfo(el));
      }
    }

    for (const group of choiceGroups.values()) {
      if (!group.some((el) => el.checked)) missing.push(fieldInfo(group[0]));
    }

    const seen = new Set();
    return missing.filter((item) => {
      const key = `${item.type}:${item.name}:${item.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function fieldCaption(el) {
    const id = el.id ? CSS.escape(el.id) : "";
    const explicit = id ? document.querySelector(`label[for="${id}"]`)?.innerText || "" : "";
    const label = el.closest("label")?.innerText || "";
    const dt = el.closest("dd")?.previousElementSibling?.innerText || "";
    const th = el.closest("td")?.previousElementSibling?.innerText || el.closest("tr")?.querySelector("th")?.innerText || "";
    const groupLabel = el.closest("[role=group], fieldset, .form-group, .field, .field-row, .inputBox, .formItem")?.querySelector("legend, .label, .title, .form-label, .field-label")?.innerText || "";
    return normalize([explicit, label, dt, th, groupLabel].filter(Boolean).join(" "));
  }

  function indexAmongSameCaption(el, selector) {
    const caption = fieldCaption(el);
    if (!caption) return -1;
    const controls = getFillableFields().filter((other) => (
      other.matches(selector) && fieldCaption(other) === caption
    ));
    return controls.indexOf(el);
  }

  function detectField(el) {
    const ctx = fieldContext(el);
    const rawName = normalize(el.name || el.id);
    const placeholder = normalize(el.placeholder || "");
    const labelCtx = normalize(fieldLabel(el));
    const allCtx = `${ctx} ${labelCtx}`;
    const autocomplete = normalize((el.autocomplete || "").split(/\s+/).pop());
    const type = String(el.type || "").toLowerCase();
    const hitoInput = /^input(\d+)$/.exec(rawName);

    if (/recaptcha|g-recaptcha|languagecheck/.test(rawName)) return "";
    if (/hito-link|hitolink/i.test(location.hostname) && hitoInput) {
      const index = Number(hitoInput[1]);
      if (index === 12) return "birthYear";
      if (index === 15) return "birthMonth";
      if (index === 18) return "birthDay";
      if (index === 27) return "mobilePhone";
    }
    if (/確認コード|認証コード|verificationcode|authcode|onetimecode|6桁/.test(allCtx + rawName)) return "verificationCode";
    if (/loginid|userid|accountid|tbxid|ログインid|ログインID|マイページid|マイページID/.test(rawName + allCtx)) return "loginId";
    if (/^local\.?email$/.test(rawName)) return "emailConfirm";
    if (/もう一度|再入力|確認/.test(allCtx) && /submail|smail|サブメール/.test(rawName + allCtx)) return "subEmailConfirm";
    if (/もう一度|再入力|確認/.test(allCtx) && /local\.?email|email|mail|メール/.test(rawName + allCtx)) return "emailConfirm";
    if (AUTOCOMPLETE_FIELDS[autocomplete]) return AUTOCOMPLETE_FIELDS[autocomplete];
    if (/^(adch|cbxkflg)$/.test(rawName) || /現住所と同じ|帰省先は現住所/.test(allCtx)) return "holidaySame";
    if (type === "checkbox" && /privacy|個人情報|プライバシー|取り扱い/.test(rawName + allCtx) && !/現住所と同じ|帰省先/.test(allCtx)) return "privacyConsent";
    if (type === "checkbox" && /terms|consent|agree|agreement|policy|kiyaku|規約|同意|利用条件/.test(rawName + allCtx) && !/現住所と同じ|帰省先/.test(allCtx)) return "termsConsent";
    if (type === "checkbox" && /kaigaig|日本国外の場合|海外住所|国外住所/.test(rawName + allCtx)) return "foreignAddress";
    if (type === "email") return /confirm|confirmation|確認|再入力|もう一度/.test(allCtx) ? "emailConfirm" : "email";
    if (placeholder === "姓") return "lastName";
    if (placeholder === "名") return "firstName";
    if (placeholder === "セイ") return "lastNameKana";
    if (placeholder === "メイ") return "firstNameKana";
    if (/password|passwd|pass|pwd|pw/.test(rawName) || type === "password") return "password";
    if (el.tagName === "SELECT" && /生年月日|誕生日|birthday|birth/.test(allCtx)) {
      const kind = selectNumberKind(el);
      if (kind === "year") return "birthYear";
      if (kind === "month") return "birthMonth";
      if (kind === "day") return "birthDay";
      const index = indexAmongSameCaption(el, "select");
      if (index === 0) return "birthYear";
      if (index === 1) return "birthMonth";
      if (index === 2) return "birthDay";
    }
    if (el.tagName === "SELECT" && /取得年月|取得日|取得時期/.test(allCtx)) {
      const kind = selectNumberKind(el);
      if (kind === "year") return "degreeYear";
      if (kind === "month") return "degreeMonth";
      const index = indexAmongSameCaption(el, "select");
      if (index === 0) return "degreeYear";
      if (index === 1) return "degreeMonth";
    }
    if (/shikbn|ddlsotsuk|graduationstatus|gradstatus/.test(rawName)) return "gradStatus";
    if (/卒業予定年月|卒業年月/.test(allCtx)) {
      const kind = el.tagName === "SELECT" ? selectNumberKind(el) : "";
      if (/_?d1$/.test(rawName) || kind === "year") return "gradYear";
      if (/_?d2$/.test(rawName) || kind === "month") return "gradMonth";
    }
    if (el.tagName === "SELECT" && /在籍期間|在学期間|在籍年月|入学.*卒業/.test(allCtx)) {
      const index = indexAmongSameCaption(el, "select");
      if (index === 0) return "schoolStartYear";
      if (index === 1) return "schoolStartMonth";
      if (index === 2) return "schoolEndYear";
      if (index === 3) return "schoolEndMonth";
    }
    if (/インターンシップ|説明会|セミナー|イベント/.test(allCtx) && type === "checkbox") return "interestedEvents";
    if (/未定|別日程|希望日程|参加希望日|開催日|説明会日程|イベント日程/.test(allCtx) && el.tagName === "SELECT") return "eventDate";
    if (/マイナビ|外資就活|就活サイト|検索エンジン|wantedly|sns|紹介会社|知人からの紹介/.test(allCtx) && el.tagName === "SELECT") return "howKnowCompany";
    if (/知ったキッカケ|知ったきっかけ|何で知った|媒体/.test(allCtx)) return "howKnowCompany";
    if (/企業理念|社会貢献|将来性|大企業|有名企業|仕事内容|休日|休暇|給与|待遇|福利厚生|職場の雰囲気|財務状況|研修制度|業界順位|勤務地で働ける/.test(allCtx)) return "companyCriteria";
    if (/^i373$/.test(rawName) || (type === "checkbox" && /ユニクロ|ジーユー|プラステ|勤務ブランド|勤務経験ブランド|勤務先ブランド/.test(allCtx))) return "employmentBrand";
    if (/^i375$/.test(rawName) || /勤務店舗|店舗名|勤務先店舗|記入例.*店/.test(allCtx)) return "employmentStore";
    if (/^i376$/.test(rawName) || /社員番号|従業員番号|スタッフ番号|8ケタ|8桁/.test(allCtx)) return "employeeNumber";
    if (/^i377d1$/.test(rawName) || /勤務開始年|入社年/.test(allCtx)) return "employmentStartYear";
    if (/^i377d2$/.test(rawName) || /勤務開始月|入社月/.test(allCtx)) return "employmentStartMonth";
    if (/^i378$/.test(rawName) || /勤務期間|アルバイト期間/.test(allCtx)) return "employmentDuration";
    if (/紹介者名|社員からの紹介|教授からの紹介|その他.*詳細|その他を選択/.test(allCtx)) return "referralDetail";
    if (/転勤する可能性|転勤.*理解|転勤可能|転勤に同意/.test(allCtx)) return "relocationConsent";
    if (/学業.*取り組|研究内容|専攻内容|学修内容|卒業研究|研究概要/.test(allCtx)) return "studyDetail";
    if (/将来像|将来の夢|将来.*やりたい|キャリアビジョン|入社後.*実現|今後の目標/.test(allCtx)) return "careerVision";
    if (/職種志望理由|希望職種.*理由|職種.*希望.*理由/.test(allCtx)) return "jobReason";
    if (/業界.*興味|事業.*興味|業界志望理由|興味を持った理由|関心を持った理由/.test(allCtx)) return "industryInterest";
    if (/就活の軸|仕事選びの軸|働く上で大切|大切にしたいこと|価値観/.test(allCtx)) return "workValues";
    if (/挑戦した経験|チャレンジした経験|挑戦したこと|困難に挑戦/.test(allCtx)) return "challengeExperience";
    if (/失敗経験|挫折経験|失敗から学んだ|挫折から学んだ|困難を乗り越えた/.test(allCtx)) return "failureExperience";
    if (/チームで取り組|チーム経験|協働経験|周囲と協力/.test(allCtx)) return "teamworkExperience";
    if (/リーダーシップ|リーダー経験|周囲を巻き込/.test(allCtx)) return "leadershipExperience";
    if (/成果|実績|表彰|受賞|達成したこと/.test(allCtx) && !/研究成果物URL|成果物URL/.test(allCtx)) return "achievement";
    if (/語学スキル|語学力|英語力|外国語/.test(allCtx)) return "languageSkills";
    if (/ITスキル|PCスキル|プログラミング|使用できるツール|github/.test(allCtx)) return "programmingSkills";
    if (/ポートフォリオ|制作物|成果物URL|github.*url|website|url/.test(allCtx) && /url|リンク|http|ポートフォリオ|github/.test(allCtx)) return "portfolioUrl";

    if (/^(tbxsmailr|account4|domain4)$/.test(rawName) || /submail.*r|smail.*r|サブメール.*再入力/.test(ctx)) return "subEmailConfirm";
    if (/^(tbxsmail|account3|domain3)$/.test(rawName) || /submail|smail|サブメール/.test(ctx)) return "subEmail";
    if (/^(tbxmailr|account2|domain2)$/.test(rawName) || /mail.*r|メール.*再入力|メール.*もう一度|もう一度.*メール/.test(ctx)) return "emailConfirm";
    if (/confirm|confirmation|確認|再入力|もう一度/.test(allCtx) && /メール|mail|email/.test(rawName + allCtx)) return "emailConfirm";
    if (/^(tbxmail|account1|domain1|email|mail|localemail)$/.test(rawName) || /メインメール/.test(ctx)) return "email";
    if (/携帯|mobile|cell/.test(ctx) && /電話|tel|phone|番号/.test(ctx)) return "mobilePhone";
    if (/郵便番号|postal|zipcode|zip/.test(ctx) && !/[12]$/.test(rawName)) return "postalCode";
    if (/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) {
      if (/_?d1$/.test(rawName)) return "lastNameKana";
      if (/_?d2$/.test(rawName)) return "firstNameKana";
      if (/1$|kanasei|yname1|sei|last|family/.test(rawName)) return "lastNameKana";
      if (/2$|kanana|yname2|mei|first|given/.test(rawName)) return "firstNameKana";
      if (/フリガナ姓|カナ氏名姓|セイ/.test(ctx)) return "lastNameKana";
      if (/フリガナ名|カナ氏名名|メイ/.test(ctx)) return "firstNameKana";
      return "fullNameKana";
    }
    if (/氏名|お名前|名前|fullname|full_name/.test(ctx) && !/kana|カナ|かな|ふりがな|フリガナ|学校|大学|会社|保護者|郵便|住所|電話|メール/.test(ctx)) {
      if (/_?d1$/.test(rawName)) return "lastName";
      if (/_?d2$/.test(rawName)) return "firstName";
    }
    if (/name1$|kanjisei|kname1|sei|last|family|surname/.test(rawName) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "lastName";
    if (/name2$|kanjina|kname2|mei|first|given/.test(rawName) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "firstName";
    if (/氏名姓|漢字氏名姓|お名前姓/.test(ctx) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "lastName";
    if (/氏名名|漢字氏名名|お名前名/.test(ctx) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "firstName";
    if (/gyubin1|tbxzip1|zip1|postal1|postalcode1/.test(rawName)) return "postal1";
    if (/gyubin2|tbxzip2|zip2|postal2|postalcode2/.test(rawName)) return "postal2";
    if (/gken|ddlken|prefecture|pref|addresslevel1/.test(rawName)) return "prefecture";
    if (/gadrs1|tbxaddr1|addr1|address1|addressline1/.test(rawName)) return "address1";
    if (/gadrs2|tbxaddr2|addr2|address2|addressline2/.test(rawName)) return "address2";
    if (type !== "checkbox" && /建物|マンション|アパート|部屋|building|apartment|クロスタワー/.test(allCtx)) return "address2";
    if (type !== "checkbox" && /住所|address|市区町村|市区郡|番地|丁目|東京都|渋谷区/.test(allCtx)) return "address1";
    if (/kttel1|tbxkeitai1|mobile1|cell1/.test(rawName)) return "mobileTel1";
    if (/kttel2|tbxkeitai2|mobile2|cell2/.test(rawName)) return "mobileTel2";
    if (/kttel3|tbxkeitai3|mobile3|cell3/.test(rawName)) return "mobileTel3";
    if (/gtel1|tbxtel11|tel1|phone1/.test(rawName)) return "homeTel1";
    if (/gtel2|tbxtel12|tel2|phone2/.test(rawName)) return "homeTel2";
    if (/gtel3|tbxtel13|tel3|phone3/.test(rawName)) return "homeTel3";
    if (/syear|ddlsotsuyy|graduationyear|gradyear/.test(rawName)) return "gradYear";
    if (/smonth|ddlsotsuym|graduationmonth|gradmonth/.test(rawName)) return "gradMonth";
    if (/shikbn|ddlsotsuk|graduationstatus|gradstatus/.test(rawName)) return "gradStatus";
    if (/cschoolshubetsu|schooltype|schoolkind/.test(rawName)) return "schoolType";
    if (/cschoolkeito|schoolsystem|schoolfield|bunri/.test(rawName)) return "humanitiesScience";
    if (/cschooltoy|schoolendyear|graduationendyear/.test(rawName)) return "schoolEndYear";
    if (/cschooltom|schoolendmonth|graduationendmonth/.test(rawName)) return "schoolEndMonth";
    if (/cschooltokubun|graduationdivision/.test(rawName)) return "gradStatus";
    if (/学位|課程|degree/.test(allCtx + rawName)) return "degree";
    if (/在留資格|residencestatus|visa|statusofresidence/.test(allCtx + rawName)) return "residenceStatus";
    if (/国籍|nationality/.test(allCtx + rawName)) return "nationality";
    if (/就労資格|就労可否|就労可能|workauthorization/.test(allCtx + rawName)) return "workAuthorization";
    if (/留学|海外経験|studyabroad|overseas/.test(allCtx + rawName)) return "studyAbroad";
    if (/障がい|障害|配慮事項|disability/.test(allCtx + rawName)) return "disabilityStatus";
    if (/職歴|勤務先|職務経歴|employment|workhistory|jobhistory|cjob/.test(allCtx + rawName)) return "employmentHistory";

    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.some((alias) => {
        const normalizedAlias = normalize(alias);
        return rawName === normalizedAlias;
      })) return field;
    }

    if (type === "checkbox") return "";

    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (field === "password") continue;
      if (aliases.some((alias) => {
        const normalizedAlias = normalize(alias);
        return normalizedAlias.length >= 2 && allCtx.includes(normalizedAlias);
      })) return field;
    }

    if (/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) {
      if (/_?d1$/.test(rawName)) return "lastNameKana";
      if (/_?d2$/.test(rawName)) return "firstNameKana";
      if (/1$|kanasei|yname1|sei|last|family/.test(rawName)) return "lastNameKana";
      if (/2$|kanana|yname2|mei|first|given/.test(rawName)) return "firstNameKana";
      if (/フリガナ姓|カナ氏名姓|セイ/.test(ctx)) return "lastNameKana";
      if (/フリガナ名|カナ氏名名|メイ/.test(ctx)) return "firstNameKana";
      return "fullNameKana";
    }
    if (/氏名|お名前|名前|fullname|full_name/.test(ctx) && !/kana|カナ|かな|ふりがな|フリガナ|学校|大学|会社|保護者|郵便|住所|電話|メール/.test(ctx)) {
      if (/_?d1$/.test(rawName)) return "lastName";
      if (/_?d2$/.test(rawName)) return "firstName";
    }
    if (/name1$|kanjisei|kname1|sei|last|family|surname/.test(rawName) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "lastName";
    if (/name2$|kanjina|kname2|mei|first|given/.test(rawName) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "firstName";
    if (/氏名姓|漢字氏名姓|お名前姓/.test(ctx) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "lastName";
    if (/氏名名|漢字氏名名|お名前名/.test(ctx) && !/kana|カナ|かな|ふりがな|フリガナ/.test(ctx)) return "firstName";
    if (/氏名|お名前|名前|fullname|full_name/.test(allCtx) && !/学校|大学|会社|保護者|郵便|住所|電話|メール/.test(allCtx)) return "fullName";
    if (/希望記入欄|希望欄|備考|連絡希望|連絡事項/.test(allCtx)) return "requestNote";
    if (/住所|address/.test(allCtx) && !/メール|mail|email/.test(allCtx)) return "fullAddress";
    if (/○○大学|学校名|大学名/.test(allCtx)) return "schoolName";
    if (/○○学部|学部名/.test(allCtx)) return "faculty";
    if (/○○学科|学科名|専攻名/.test(allCtx)) return "department";
    if (/電話|tel|phone/.test(allCtx)) return "phone";
    return "";
  }

  function profileValues(profile) {
    const email = splitEmail(profile.email);
    const subEmail = splitEmail(profile.subEmail);
    const postal = splitPostal(profile.postalCode);
    const homeTel = splitPhone(profile.homePhone);
    const mobileTel = splitPhone(profile.mobilePhone);
    const gradYearNum = Number(String(profile.gradYear || "").replace(/\D/g, ""));
    const inferredSchoolStartYear = gradYearNum ? String(gradYearNum - 4) : "";

    return {
      fullName: [profile.lastName, profile.firstName].filter(Boolean).join(" "),
      fullNameKana: [profile.lastNameKana, profile.firstNameKana].filter(Boolean).join(" "),
      lastName: profile.lastName,
      firstName: profile.firstName,
      lastNameKana: profile.lastNameKana,
      firstNameKana: profile.firstNameKana,
      email: profile.email,
      emailConfirm: profile.email,
      subEmail: profile.subEmail,
      subEmailConfirm: profile.subEmail,
      birthYear: profile.birthYear,
      birthMonth: two(profile.birthMonth),
      birthDay: two(profile.birthDay),
      gender: profile.gender,
      postal1: postal[0],
      postal2: postal[1],
      postalCode: postal.filter(Boolean).join("-"),
      prefecture: profile.prefecture,
      fullAddress: [profile.prefecture, profile.address1, profile.address2].filter(Boolean).join(""),
      address1: profile.address1,
      address2: profile.address2,
      phone: profile.mobilePhone || profile.homePhone,
      mobilePhone: profile.mobilePhone,
      homeTel1: homeTel[0],
      homeTel2: homeTel[1],
      homeTel3: homeTel[2],
      mobileTel1: mobileTel[0],
      mobileTel2: mobileTel[1],
      mobileTel3: mobileTel[2],
      holidaySame: profile.holidaySame,
      gradYear: profile.gradYear,
      gradMonth: two(profile.gradMonth),
      gradStatus: profile.gradStatus,
      schoolName: profile.schoolName,
      faculty: profile.faculty,
      department: profile.department,
      schoolType: profile.schoolType,
      schoolStartYear: profile.schoolStartYear || inferredSchoolStartYear,
      schoolStartMonth: two(profile.schoolStartMonth || "04"),
      schoolEndYear: profile.schoolEndYear || profile.gradYear,
      schoolEndMonth: two(profile.schoolEndMonth || profile.gradMonth),
      degree: profile.degree,
      degreeYear: profile.degreeYear || profile.gradYear,
      degreeMonth: two(profile.degreeMonth || profile.gradMonth),
      humanitiesScience: profile.humanitiesScience,
      seminar: profile.seminar,
      researchTheme: profile.researchTheme,
      club: profile.club,
      qualification: profile.qualification,
      driverLicense: profile.driverLicense,
      toeic: profile.toeic,
      desiredJob: profile.desiredJob,
      desiredLocation: profile.desiredLocation,
      companyCriteria: profile.companyCriteria,
      interestedEvents: profile.interestedEvents,
      eventDate: profile.eventDate,
      requestNote: profile.requestNote,
      termsConsent: profile.termsConsent,
      privacyConsent: profile.privacyConsent,
      nationality: profile.nationality,
      residenceStatus: profile.residenceStatus,
      workAuthorization: profile.workAuthorization,
      studyAbroad: profile.studyAbroad,
      disabilityStatus: profile.disabilityStatus,
      employmentHistory: profile.employmentHistory,
      noAnswer: profile.noAnswer,
      motivation: profile.motivation,
      selfPr: profile.selfPr,
      studentEffort: profile.studentEffort,
      studyDetail: profile.studyDetail,
      strengths: profile.strengths,
      weakness: profile.weakness,
      careerVision: profile.careerVision,
      jobReason: profile.jobReason,
      industryInterest: profile.industryInterest,
      workValues: profile.workValues,
      challengeExperience: profile.challengeExperience,
      failureExperience: profile.failureExperience,
      teamworkExperience: profile.teamworkExperience,
      leadershipExperience: profile.leadershipExperience,
      achievement: profile.achievement,
      languageSkills: profile.languageSkills,
      programmingSkills: profile.programmingSkills,
      portfolioUrl: profile.portfolioUrl,
      howKnowCompany: profile.howKnowCompany,
      internshipExperience: profile.internshipExperience,
      loginId: profile.loginId || profile.email,
      verificationCode: profile.verificationCode,
      password: profile.password,
      foreignAddress: profile.foreignAddress,
      referralDetail: profile.referralDetail,
      employmentBrand: profile.employmentBrand,
      employmentStore: profile.employmentStore,
      employeeNumber: profile.employeeNumber,
      employmentStartYear: profile.employmentStartYear,
      employmentStartMonth: two(profile.employmentStartMonth),
      employmentDuration: profile.employmentDuration,
      relocationConsent: profile.relocationConsent,
      account1: email.account,
      domain1: email.domain,
      account2: email.account,
      domain2: email.domain,
      account3: subEmail.account,
      domain3: subEmail.domain,
      account4: subEmail.account,
      domain4: subEmail.domain
    };
  }

  function valueFor(el, field, values) {
    const key = normalize(el.name || el.id);
    if (/_?d1$/.test(key)) {
      if (field === "fullName") return values.lastName;
      if (field === "fullNameKana") return values.lastNameKana;
      if (field === "phone") return values.homeTel1 || splitPhone(values.phone)[0];
      if (field === "mobilePhone") return values.mobileTel1;
      if (field === "postalCode") return values.postal1;
    }
    if (/_?d2$/.test(key)) {
      if (field === "fullName") return values.firstName;
      if (field === "fullNameKana") return values.firstNameKana;
      if (field === "phone") return values.homeTel2 || splitPhone(values.phone)[1];
      if (field === "mobilePhone") return values.mobileTel2;
      if (field === "postalCode") return values.postal2;
    }
    if (/_?d3$/.test(key)) {
      if (field === "phone") return values.homeTel3 || splitPhone(values.phone)[2];
      if (field === "mobilePhone") return values.mobileTel3;
    }
    if (values[key] !== undefined) return values[key];
    return values[field];
  }

  function setNativeValue(el, value) {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    if (el.getAttribute("role") === "combobox" || el.getAttribute("aria-label") === "Open" || el.getAttribute("title") === "Open") {
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
      el.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true }));
    }
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function isVisible(el) {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
  }

  function isCustomSelectInput(el) {
    if (el.tagName !== "INPUT") return false;
    const root = el.closest(".v-input, .v-select, .v-autocomplete, .v-combobox, .ats-select, [role=combobox]");
    const ctx = `${el.getAttribute("role") || ""} ${el.getAttribute("aria-label") || ""} ${el.getAttribute("title") || ""} ${el.getAttribute("inputmode") || ""} ${root?.className || ""}`;
    return /combobox|Open|none|v-select|v-autocomplete|v-combobox|ats-select/.test(ctx);
  }

  function customSelectRoot(el) {
    return el.closest(".v-input, .v-select, .v-autocomplete, .v-combobox, .ats-select, [role=combobox]") || el;
  }

  function customSelectClickTarget(el) {
    const root = customSelectRoot(el);
    return root.querySelector('.v-field[role="button"][aria-owns], .v-field[role="button"], .v-field, .v-input__control, .v-field__append-inner, .v-select__selection, .v-field__input') || el;
  }

  function activateElement(el) {
    const events = ["pointerdown", "mousedown", "pointerup", "mouseup", "click"];
    for (const type of events) {
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    }
  }

  function visibleCustomOptions(menuId = "") {
    const optionSelectors = [
      ".v-overlay--active .v-list-item",
      "[role=option]",
      ".v-list-item",
      ".v-list-item-title",
      ".v-list-item__content",
      ".v-overlay .v-list *",
      ".v-menu__content *",
      ".menuable__content__active *",
      "li"
    ].join(",");
    const containers = [];
    const menu = menuId ? document.getElementById(menuId) : null;
    if (menu) containers.push(menu);
    containers.push(document);
    const seen = new Set();
    return containers.flatMap((container) => Array.from(container.querySelectorAll(optionSelectors)))
      .filter((option) => isVisible(option))
      .map((option) => {
        const el = option.closest("[role=option], .v-list-item, li") || option;
        const text = (option.innerText || option.textContent || "").replace(/\s+/g, " ").trim();
        return { el, text };
      })
      .filter((option) => {
        if (!option.text) return false;
        const key = `${option.text}:${option.el.tagName}:${option.el.className}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function valueForChoiceField(wanted, field) {
    const value = String(wanted || "");
    if ((field === "qualification" || field === "driverLicense") && /免許|資格|toeic|toefl|ielts|有|あり/i.test(value)) return "有";
    if (field === "relocationConsent" && /はい|可能|可|理解|同意|yes/i.test(value)) return "はい";
    if (field === "workAuthorization" && /可能|可|はい|yes/i.test(value)) return "可能";
    if (field === "humanitiesScience" && /文系|人文|社会|経済|商|法/.test(value)) return "その他文系";
    if (field === "humanitiesScience" && /理系|理工|工学|情報|自然科学/.test(value)) return "その他理系";
    return value;
  }

  function preferredCustomOptions(field, wanted) {
    const value = normalize(wanted);
    if (field === "howKnowCompany") {
      if (/マイナビ|リクナビ|就活|ナビ|サイト/.test(value)) return ["リクルートサイト", "キャリタス就活", "その他"];
      if (/ホームページ|hp|web/.test(value)) return ["当社ホームページ", "リクルートサイト"];
      return ["その他"];
    }
    if (field === "qualification" || field === "driverLicense") {
      if (/なし|無|ない|×/.test(value)) return ["×", "なし", "無"];
      return ["〇", "○", "有", "はい"];
    }
    if (field === "relocationConsent" || field === "workAuthorization") {
      if (/いいえ|不可|×|なし/.test(value)) return ["いいえ", "×"];
      return ["はい", "可能", "可"];
    }
    return [];
  }

  async function setCustomSelectInput(el, wanted, field = "") {
    if (!isCustomSelectInput(el)) return false;
    const root = customSelectRoot(el);
    const clickTarget = customSelectClickTarget(el);
    const menuId = clickTarget.getAttribute("aria-owns") || root.querySelector("[aria-owns]")?.getAttribute("aria-owns") || "";
    const candidates = Array.from(new Set([wanted, valueForChoiceField(wanted, field)].filter(Boolean)));
    const canType = el.getAttribute("inputmode") !== "none" && !/v-select--single/.test(String(root.className || ""));

    el.focus();
    const proto = HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;

    for (const candidate of candidates) {
      el.scrollIntoView({ block: "center", inline: "nearest" });
      await wait(80);
      activateElement(clickTarget);
      activateElement(root);
      el.focus();
      activateElement(el);
      await wait(160);
      if (canType) {
        if (setter) setter.call(el, "");
        else el.value = "";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        await wait(40);
        if (setter) setter.call(el, candidate);
        else el.value = candidate;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
      await wait(700);

      const options = visibleCustomOptions(menuId);
      const preferred = preferredCustomOptions(field, wanted).map((item) => normalize(item));
      const found = options.find((option) => optionMatches(option.text, candidate, field) || optionMatches(option.text, wanted, field))
        || options.find((option) => preferred.includes(normalize(option.text)));
      if (found) {
        activateElement(found.el);
        await wait(320);
        el.dispatchEvent(new Event("blur", { bubbles: true }));
        const rootText = root.innerText.trim();
        if (hasFieldValue(el) || rootText.includes(candidate) || rootText.includes(found.text)) return true;
      }

      el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", code: "ArrowDown", bubbles: true }));
      el.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowDown", code: "ArrowDown", bubbles: true }));
      await wait(60);
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
      el.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true }));
      await wait(220);
      el.dispatchEvent(new Event("blur", { bubbles: true }));
      if (hasFieldValue(el) || root.innerText.trim().includes(candidate)) return true;
    }

    el.dispatchEvent(new Event("blur", { bubbles: true }));
    return hasFieldValue(el);
  }

  function findSelectOption(select, wanted, field = "") {
    const normalized = normalize(wanted);
    const options = Array.from(select.options);
    const exact = options.find((option) => normalize(option.value) === normalized || normalize(option.text) === normalized);
    const padded = options.find((option) => normalize(option.value) === normalize(two(wanted)) || normalize(option.text) === normalize(two(wanted)));
    const numericWanted = String(wanted || "").replace(/^0+/, "");
    const numeric = options.find((option) => numericWanted && (String(option.value).replace(/^0+/, "") === numericWanted || String(option.text).replace(/^0+/, "") === numericWanted));
    const pref = options.find((option) => PREFECTURES.includes(String(wanted)) && option.text === wanted);
    const graduation = field === "gradStatus"
      ? options.find((option) => {
          const text = normalize(option.text);
          const value = normalize(wanted);
          return (value.includes("見込み") && text.includes("卒業予定")) || (value.includes("予定") && text.includes("見込み"));
        })
      : null;
    const fuzzy = options.find((option) => optionMatches(`${option.text} ${option.value}`, wanted, field));
    return exact || padded || numeric || pref || graduation || fuzzy;
  }

  async function selectByTextOrValue(select, wanted, field = "") {
    const candidates = Array.from(new Set([wanted, valueForChoiceField(wanted, field)].filter(Boolean)));
    let found = null;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      for (const candidate of candidates) {
        found = findSelectOption(select, candidate, field);
        if (found) break;
      }
      if (found) break;
      await wait(180);
    }
    if (!found) return false;
    select.value = found.value;
    found.selected = true;
    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    select.dispatchEvent(new Event("blur", { bubbles: true }));
    await wait(260);
    return true;
  }

  function forceSelectByTextOrValue(select, wanted, field = "") {
    const candidates = Array.from(new Set([wanted, valueForChoiceField(wanted, field)].filter(Boolean)));
    let found = null;
    for (const candidate of candidates) {
      found = findSelectOption(select, candidate, field);
      if (found) break;
    }
    if (!found) return false;
    select.value = found.value;
    found.selected = true;
    return hasFieldValue(select);
  }

  function setRadio(el, field, value) {
    const raw = normalize(optionLabel(el));
    const wanted = normalize(value);
    const genderMatch =
      field === "gender" &&
      ((wanted === "male" || wanted === "男性" || wanted === "男") && /male|男性|男|sex1|cd1|rbtsex1/.test(raw) ||
        (wanted === "female" || wanted === "女性" || wanted === "女") && /female|女性|女|sex2|cd2|rbtsex2/.test(raw) ||
        (wanted === "none" || wanted === "無回答") && /無回答|none|sex3|rbtsex3/.test(raw));
    if (!genderMatch && raw !== wanted && !optionMatches(raw, value, field)) return false;
    if (!el.checked) el.click();
    el.checked = true;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function findFieldElement(info) {
    const controls = getFillableFields();
    if (info.name) {
      const found = controls.find((el) => (el.name || el.id) === info.name);
      if (found) return found;
    }
    return controls.find((el) => detectField(el) === info.field && debugLabel(el) === info.label)
      || controls.find((el) => detectField(el) === info.field && !hasFieldValue(el));
  }

  async function fillOneField(el, field, wanted, overwrite) {
    if (!el || wanted === undefined || wanted === null || wanted === "") return false;
    if (!overwrite && el.value && el.type !== "radio" && el.type !== "checkbox") return false;
    if (el.tagName === "SELECT") return selectByTextOrValue(el, wanted, field);
    if (el.type === "radio") return setRadio(el, field, wanted);
    if (el.type === "checkbox") {
      if (["holidaySame", "termsConsent", "privacyConsent", "foreignAddress"].includes(field)) {
        const shouldCheck = Boolean(wanted);
        if (el.checked !== shouldCheck) activateElement(el);
        el.checked = shouldCheck;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      if (!optionMatches(optionLabel(el), wanted, field)) return false;
      if (!el.checked) activateElement(el);
      el.checked = true;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    const customSelect = isCustomSelectInput(el);
    const customOk = await setCustomSelectInput(el, wanted, field);
    if (customOk) return true;
    if (customSelect) {
      const root = customSelectRoot(el);
      const canType = el.getAttribute("inputmode") !== "none" && !/v-select--single/.test(String(root.className || ""));
      if (!canType) return false;
    }
    setNativeValue(el, wanted);
    return true;
  }

  async function refillMissingRequired(values, customAnswers, overwrite, matches, skipped) {
    for (let pass = 0; pass < 3; pass += 1) {
      const missing = emptyRequiredFields();
      if (!missing.length) return;
      let changed = false;
      for (const item of missing) {
        const el = findFieldElement(item);
        if (!el) continue;
        const field = detectField(el);
        const customWanted = customAnswerFor(el, customAnswers);
        const wanted = customWanted || (field ? valueFor(el, field, values) : "");
        const effectiveField = field || "customAnswer";
        const before = hasFieldValue(el) ? String(el.value || optionLabel(el) || "") : "";
        const ok = await fillOneField(el, effectiveField, wanted, overwrite);
        await wait(180);
        const forced = !hasFieldValue(el) && el.tagName === "SELECT"
          ? forceSelectByTextOrValue(el, wanted, effectiveField)
          : false;
        const after = hasFieldValue(el) ? String(el.value || optionLabel(el) || "") : "";
        if (ok || forced) {
          matches.push({ field: effectiveField, name: el.name || el.id, tag: el.tagName.toLowerCase(), retry: true });
          changed = changed || before !== after || hasFieldValue(el);
        } else {
          skipped.push({ field: effectiveField, name: el.name || el.id, reason: "required-retry-failed" });
        }
      }
      if (!changed) return;
    }
  }

  function selectOptionSilently(select, matcher) {
    const found = Array.from(select.options).find((option) => matcher(normalize(option.text), normalize(option.value), option));
    if (!found) return false;
    select.value = found.value;
    found.selected = true;
    return hasFieldValue(select);
  }

  function selectPreferredTextSilently(select, texts) {
    const normalizedTexts = texts.map((text) => normalize(text));
    const found = Array.from(select.options).find((option) => normalizedTexts.includes(normalize(option.text)));
    if (!found) return false;
    select.value = found.value;
    found.selected = true;
    return hasFieldValue(select);
  }

  async function selectActiveVuetifyOption(el, field, wanted) {
    const root = customSelectRoot(el);
    const button = root.querySelector('.v-field[role="button"], [role="button"][aria-owns], .v-field') || el;
    const preferred = preferredCustomOptions(field, wanted).map((item) => normalize(item));
    el.scrollIntoView({ block: "center", inline: "nearest" });
    await wait(80);
    activateElement(button);
    await wait(750);
    const items = Array.from(document.querySelectorAll(".v-overlay--active .v-list-item"))
      .map((item) => ({
        el: item,
        text: (item.innerText || item.textContent || "").replace(/\s+/g, " ").trim()
      }))
      .filter((item) => item.text);
    const found = items.find((item) => optionMatches(item.text, wanted, field))
      || items.find((item) => preferred.includes(normalize(item.text)));
    if (!found) return false;
    activateElement(found.el);
    await wait(500);
    return hasFieldValue(el) || root.innerText.includes(found.text);
  }

  async function applyPlatformSpecificFinalValues(values, matches) {
    if (/job\.axol\.jp$/i.test(location.hostname)) {
      const schoolField = document.querySelector('select[name="c_school_keito"]');
      if (schoolField && !hasFieldValue(schoolField)) {
        const raw = normalize(values.humanitiesScience);
        const ok = /理系|理工|工学|情報|自然科学/.test(raw)
          ? selectPreferredTextSilently(schoolField, ["その他理系"]) || selectOptionSilently(schoolField, (text) => /理系|理工|工学|情報/.test(text))
          : selectPreferredTextSilently(schoolField, ["その他文系"]) || selectOptionSilently(schoolField, (text) => /文系|文学|経済|経営|管理|社会|法/.test(text));
        if (ok) matches.push({ field: "humanitiesScience", name: "c_school_keito", tag: "select", retry: true, platformFinal: true });
      }

      const gradField = document.querySelector('select[name="c_school_to_kubun"]');
      if (gradField && !hasFieldValue(gradField)) {
        const raw = normalize(values.gradStatus);
        const ok = /修了/.test(raw)
          ? selectPreferredTextSilently(gradField, ["修了予定"]) || selectOptionSilently(gradField, (text) => /修了/.test(text))
          : selectPreferredTextSilently(gradField, ["卒業予定"]) || selectOptionSilently(gradField, (text) => /卒業/.test(text));
        if (ok) matches.push({ field: "gradStatus", name: "c_school_to_kubun", tag: "select", retry: true, platformFinal: true });
      }
    }

    if (/hito-link|hitolink/i.test(location.hostname)) {
      const targets = [
        { selector: "#input-84", field: "howKnowCompany", wanted: values.howKnowCompany },
        { selector: "#input-98", field: "qualification", wanted: values.qualification || values.driverLicense },
        { selector: "#input-158", field: "relocationConsent", wanted: values.relocationConsent }
      ];
      for (const target of targets) {
        const el = document.querySelector(target.selector);
        if (!el || hasFieldValue(el)) continue;
        const ok = await selectActiveVuetifyOption(el, target.field, target.wanted);
        if (ok) matches.push({ field: target.field, name: el.name || el.id, tag: el.tagName.toLowerCase(), retry: true, platformFinal: true });
      }
    }
  }

  async function fill(profile, options = {}) {
    const values = profileValues(profile);
    const customAnswers = customAnswerMap(profile);
    const overwrite = options.overwrite !== false;
    const fields = getFillableFields();
    const matches = [];
    const skipped = [];
    const completedRadioGroups = new Set();

    for (const el of fields) {
      const field = detectField(el);
      const customWanted = customAnswerFor(el, customAnswers);
      const wanted = customWanted || (field ? valueFor(el, field, values) : "");
      if (wanted === undefined || wanted === null || wanted === "") continue;
      const effectiveField = field || "customAnswer";
      const radioGroupKey = el.type === "radio" ? `${effectiveField}:${el.name || el.id || effectiveField}` : "";
      if (radioGroupKey && completedRadioGroups.has(radioGroupKey)) continue;
      if (!overwrite && el.value && el.type !== "radio" && el.type !== "checkbox") {
        skipped.push({ field: effectiveField, name: el.name || el.id, reason: "already-filled" });
        continue;
      }

      const ok = await fillOneField(el, effectiveField, wanted, overwrite);

      if (ok) {
        if (radioGroupKey) completedRadioGroups.add(radioGroupKey);
        matches.push({ field: effectiveField, name: el.name || el.id, tag: el.tagName.toLowerCase() });
      }
      else if (el.type !== "checkbox") skipped.push({ field: effectiveField, name: el.name || el.id, reason: "no-option" });
    }

    await refillMissingRequired(values, customAnswers, overwrite, matches, skipped);
    await applyPlatformSpecificFinalValues(values, matches);

    const currentFields = getFillableFields();
    const unresolvedSkipped = skipped.filter((item) => {
      const el = currentFields.find((candidate) =>
        (candidate.name || candidate.id) === item.name && (detectField(candidate) || "customAnswer") === item.field
      );
      if (!el) return true;
      if (hasFieldValue(el)) return false;
      return item.field === "customAnswer" || isRequiredField(el);
    });
    const detected = currentFields
      .map((el) => fieldInfo(el))
      .filter((item) => item.field);
    const unknownFields = currentFields
      .map((el) => fieldInfo(el))
      .filter((item) => !item.field);
    const remainingRequired = emptyRequiredFields();
    return {
      fields: currentFields.length,
      detected: detected.length,
      detectedFields: detected.slice(0, 80),
      unknown: unknownFields.length,
      unknownFields: unknownFields.slice(0, 40),
      matched: matches.length,
      skipped: unresolvedSkipped.length,
      skippedItems: unresolvedSkipped.slice(0, 40),
      attemptedSkipped: skipped.length,
      matches,
      remainingRequiredCount: remainingRequired.length,
      remainingRequired: remainingRequired.slice(0, 30),
      url: location.href,
      platform: platform()
    };
  }

  function getFillableFields() {
    return Array.from(document.querySelectorAll("input, select, textarea")).filter((el) => {
      const type = String(el.type || "").toLowerCase();
      const name = normalize(el.name || el.id);
      if (/recaptcha|g-recaptcha|languagecheck/.test(name)) return false;
      return !["hidden", "submit", "button", "image", "reset", "file"].includes(type) && !el.disabled && !el.readOnly;
    });
  }

  function platform() {
    const host = location.hostname;
    const hint = `${location.pathname} ${location.search} ${document.title}`;
    const found = PLATFORM_RULES.find((rule) => rule.host.test(host) || rule.hint.test(hint));
    if (found) return found.label;
    if (/herp\.cloud|hrmos\.co|talentio\.com|greenhouse\.io|lever\.co/i.test(location.hostname)) return "採用管理ツール系";
    return "汎用フォーム";
  }

  function scan() {
    const fields = getFillableFields();
    const detected = fields
      .map((el) => fieldInfo(el))
      .filter((item) => item.field);
    const unknownFields = fields
      .map((el) => fieldInfo(el))
      .filter((item) => !item.field);
    const remainingRequired = emptyRequiredFields();
    return {
      platform: platform(),
      title: document.title,
      url: location.href,
      fields: fields.length,
      detected: detected.length,
      detectedFields: detected.slice(0, 80),
      unknown: unknownFields.length,
      unknownFields: unknownFields.slice(0, 40),
      remainingRequiredCount: remainingRequired.length,
      remainingRequired: remainingRequired.slice(0, 30),
      entryCandidates: findEntryCandidates()
    };
  }

  function ensureHighlightStyle() {
    if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = HIGHLIGHT_STYLE_ID;
    style.textContent = `
      [${HIGHLIGHT_ATTR}="detected"] { outline: 3px solid #1f7a5f !important; outline-offset: 2px !important; background-color: rgba(31, 122, 95, 0.08) !important; }
      [${HIGHLIGHT_ATTR}="unknown"] { outline: 3px solid #b54708 !important; outline-offset: 2px !important; background-color: rgba(181, 71, 8, 0.08) !important; }
      [${HIGHLIGHT_ATTR}="required"] { outline: 3px solid #d92d20 !important; outline-offset: 2px !important; background-color: rgba(217, 45, 32, 0.10) !important; }
    `;
    document.documentElement.appendChild(style);
  }

  function clearHighlights() {
    for (const el of document.querySelectorAll(`[${HIGHLIGHT_ATTR}]`)) el.removeAttribute(HIGHLIGHT_ATTR);
  }

  function highlightFields() {
    ensureHighlightStyle();
    clearHighlights();
    const fields = getFillableFields();
    for (const el of fields) {
      el.setAttribute(HIGHLIGHT_ATTR, detectField(el) ? "detected" : "unknown");
      el.title = [el.title, debugLabel(el)].filter(Boolean).join(" / ").slice(0, 240);
    }
    for (const item of emptyRequiredFields()) {
      const target = fields.find((el) => (el.name || el.id) === item.name && (el.type || el.tagName.toLowerCase()) === item.type) ||
        fields.find((el) => debugLabel(el) === item.label);
      if (target) target.setAttribute(HIGHLIGHT_ATTR, "required");
    }
    return scan();
  }

  function candidateFrom(el) {
    const form = el.closest("form");
    return {
      text: (el.innerText || el.value || el.alt || "").trim().replace(/\s+/g, " ").slice(0, 120),
      id: el.id || "",
      name: el.name || "",
      href: el.href || "",
      formAction: form?.action || "",
      formId: form?.id || form?.name || "",
      reason: ""
    };
  }

  function findEntryCandidates() {
    const candidates = [];
    const add = (item, reason) => {
      item.reason = reason;
      if (!candidates.some((candidate) => JSON.stringify(candidate) === JSON.stringify(item))) candidates.push(item);
    };

    for (const form of Array.from(document.forms)) {
      const action = form.action || "";
      const text = form.innerText || "";
      if (/entry|recruitment|apply|signup|register|member|mypage/i.test(action) || /新規登録|プレエントリー|エントリー|会員登録|マイページ作成|応募|同意する|登録する|申し込む/.test(text)) {
        add({ text: text.trim().replace(/\s+/g, " ").slice(0, 120), id: form.id, name: form.name, href: "", formAction: action, formId: form.id || form.name, reason: "" }, "form");
      }
    }

    for (const el of Array.from(document.querySelectorAll("a, button, input[type=button], input[type=submit], input[type=image]"))) {
      const label = (el.innerText || el.value || el.alt || "").trim();
      const href = el.href || "";
      const idName = `${el.id || ""} ${el.name || ""}`;
      const combined = `${label} ${href} ${idName}`;
      if (/新規登録|プレエントリー|エントリー|会員登録|マイページ作成|応募する|応募|同意する|次\s*へ|登録|申し込む|apply|sign\s*up|register|join/i.test(label) || /first_access|lkb_apply|lkb_agree|lkb_next_prf|entry|apply|signup|register/i.test(idName) || /entry|apply|recruitment|signup|register|member|mypage/i.test(href)) {
        add(candidateFrom(el), "button-or-link");
      }
      if (PLATFORM_ENTRY_HINT.test(combined) && /entry|apply|register|signup|mypage|resume|profile|submission|応募|登録|エントリー|マイページ|OpenES|ES/i.test(combined)) {
        add(candidateFrom(el), "platform-entry");
      }
    }

    const currentPlatform = platform();

    if (currentPlatform === "i-web / i-webs") {
      const parts = location.pathname.split("/").filter(Boolean);
      if (parts[0]) {
        add({
          text: "i-web / i-webs 登録入口候補",
          id: "",
          name: "",
          href: `${location.origin}/${parts[0]}/applicant/entry/index/entrycd/`,
          formAction: `${location.origin}/${parts[0]}/applicant/recruitment/index`,
          formId: "",
          reason: "known-iwebs-pattern"
        }, "known-iwebs-pattern");
      }
    }

    if (currentPlatform === "sonar ATS / SNAR") {
      add({
        text: "sonar ATS / SNAR エントリー入口候補",
        id: "",
        name: "",
        href: `${location.origin}/index.aspx`,
        formAction: `${location.origin}/jobboard/apply.aspx`,
        formId: "",
        reason: "known-snar-pattern"
      }, "known-snar-pattern");
    }

    if (/AOL|アクセスオンライン|e2R|JobSuite|HITO-Link|HRMOS|My CareerBox|OpenES/.test(currentPlatform)) {
      add({
        text: `${currentPlatform} 現在ページ候補`,
        id: "",
        name: "",
        href: location.href,
        formAction: "",
        formId: "",
        reason: "known-platform-pattern"
      }, "known-platform-pattern");
    }

    if (!candidates.length) {
      add({
        text: "汎用候補: ページ内の登録・応募ボタンを探してください",
        id: "",
        name: "",
        href: location.href,
        formAction: "",
        formId: "",
        reason: "generic"
      }, "generic");
    }

    return candidates.slice(0, 20);
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) return false;
    if (message.type === "SCAN_ACTIVE") {
      sendResponse(scan());
      return true;
    }
    if (message.type === "FILL_ACTIVE") {
      fill(message.profile || {}, message.options || {})
        .then((result) => sendResponse(result))
        .catch((error) => sendResponse({ matched: 0, skipped: 0, matches: [], skipped: [], error: error.message, url: location.href, platform: platform() }));
      return true;
    }
    if (message.type === "FIND_ENTRY_ACTIVE") {
      sendResponse({ platform: platform(), url: location.href, candidates: findEntryCandidates() });
      return true;
    }
    if (message.type === "HIGHLIGHT_ACTIVE") {
      sendResponse(highlightFields());
      return true;
    }
    if (message.type === "CLEAR_HIGHLIGHT_ACTIVE") {
      clearHighlights();
      sendResponse({ ok: true, platform: platform(), url: location.href });
      return true;
    }
    return false;
  });
})();

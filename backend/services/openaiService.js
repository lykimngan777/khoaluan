const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const SYSTEM_PROMPTS = require('./promptTemplates');

// Initialize OpenAI client if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Initialize Gemini client if API key is provided
let gemini = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Call AI service with context, stage, and message history
 * @param {string} stage - PRESCREENING, IN_DEPTH, CHOICE
 * @param {Array} history - Previous messages
 * @param {string} userMessage - Latest user message
 * @param {object} session - Full session state object
 */
async function getAICounselorResponse(stage, history, userMessage, session) {
  // 1. If Gemini is configured, use Gemini API (Free tier ready)
  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const systemInstruction = SYSTEM_PROMPTS[stage] || SYSTEM_PROMPTS.PRESCREENING;
      
      const userStateContext = `
[CURRENT CONTEXT]
Stage: ${session.stage}
Sub-stage: ${session.subStage || 'WELCOME'}
Shortlisted careers: ${JSON.stringify(session.shortlistedCareers)}
Selected criteria: ${JSON.stringify(session.selectedCriteria)}
Selected target career: ${session.selectedCareer || 'None'}
Profile info: ${JSON.stringify(session.profileInfo || {})}
Expert consultation requested: ${session.expertConsulted ? 'Yes' : 'No'}
`;

      const geminiHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({
        history: geminiHistory,
        systemInstruction: systemInstruction + "\n\n" + userStateContext,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      });

      const result = await chat.sendMessage(userMessage);
      return {
        text: result.response.text(),
        isSimulated: false
      };
    } catch (error) {
      console.error("Gemini API Error, falling back to simulator:", error.message);
      return simulateAICounselorResponse(stage, history, userMessage, session);
    }
  }

  // 2. If OpenAI is configured, use OpenAI API
  if (openai) {
    try {
      const systemInstruction = SYSTEM_PROMPTS[stage] || SYSTEM_PROMPTS.PRESCREENING;
      
      // Enrich prompt with session metadata
      const userStateContext = `
[CURRENT CONTEXT]
Stage: ${session.stage}
Sub-stage: ${session.subStage || 'WELCOME'}
Shortlisted careers: ${JSON.stringify(session.shortlistedCareers)}
Selected criteria: ${JSON.stringify(session.selectedCriteria)}
Selected target career: ${session.selectedCareer || 'None'}
Profile info: ${JSON.stringify(session.profileInfo || {})}
Expert consultation requested: ${session.expertConsulted ? 'Yes' : 'No'}
`;

      const formattedMessages = [
        { role: 'system', content: systemInstruction + "\n\n" + userStateContext },
        ...history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800
      });

      return {
        text: response.choices[0].message.content,
        isSimulated: false
      };
    } catch (error) {
      console.error("OpenAI API Error, falling back to simulator:", error.message);
      return simulateAICounselorResponse(stage, history, userMessage, session);
    }
  }

  // 3. If neither is configured, fallback to simulation
  return simulateAICounselorResponse(stage, history, userMessage, session);
}

/**
 * Simulate counselor responses if API Key is not set up
 */
function simulateAICounselorResponse(stage, history, userMessage, session) {
  const msgLower = userMessage.toLowerCase();
  
  // Get or default subStage
  let subStage = session.subStage || 'WELCOME';
  let responseText = '';
  let nextStage = stage;
  let nextSubStage = subStage;
  let updatedShortlisted = [...(session.shortlistedCareers || [])];
  let updatedRoadmap = session.finalRoadmap;

  // WELCOME (Initial question, now guides to profile gathering)
  if (subStage === 'WELCOME') {
    responseText = "Chào bạn! Mình là CareerAI, trợ lý hướng nghiệp cá nhân của bạn. Rất vui được đồng hành cùng bạn trên hành trình định hình tương lai theo mô hình PIC (Sàng lọc - Khám phá - Lựa chọn).\n\nĐể bắt đầu, **vui lòng nhập thông tin hồ sơ học tập và kinh nghiệm của bạn** ở bảng điều khiển bên dưới để mình có cơ sở phân tích và tư vấn chính xác nhất nhé!";
    nextSubStage = 'PROFILE_GATHERING';
  }
  // PROFILE_GATHERING (Gathering and analyzing personal profile details - FIRST STEP)
  else if (subStage === 'PROFILE_GATHERING') {
    responseText = "Cảm ơn bạn đã cung cấp hồ sơ cá nhân chi tiết! Mình đã ghi nhận các thông tin về sở thích, ngành học, kỹ năng, học lực/kinh nghiệm và mục tiêu của bạn.\n\nBây giờ, **bạn đã có sẵn danh sách các ngành nghề mà mình đang quan tâm hay chưa?**\n*(Hãy bấm nút lựa chọn bên dưới để chúng ta bắt đầu nhé!)*";
    nextSubStage = 'CLASSIFY_PATH';
  }
  // CLASSIFY_PATH (Processing user choice: Yes or No)
  else if (subStage === 'CLASSIFY_PATH') {
    if (msgLower.includes('đã có') || msgLower.includes('có rồi') || msgLower.includes('yes') || msgLower.includes('co') || msgLower.includes('rồi')) {
      responseText = "Tuyệt vời! Việc bạn đã xác định được một vài hướng đi là điểm khởi đầu rất tốt. **Hãy liệt kê 3 ngành nghề** bạn đang quan tâm nhất hiện tại (phân cách bằng dấu phẩy nhé).\n\n*Ví dụ: Kỹ sư Phần mềm, Phân tích dữ liệu, Thiết kế Đồ họa.*\n\n*(Lưu ý: Bạn nên liệt kê đủ 3 nghề để sàng lọc PIC hiệu quả nhất. Nếu bạn có ít hơn 3 nghề (1 hoặc 2), hệ thống vẫn hỗ trợ chuyển tiếp trực tiếp sang khảo sát tiêu chí sàng lọc và giữ các nghề này ở mục \"Nghề tự đề xuất\" riêng biệt).*";
      nextSubStage = 'LISTING_CAREERS';
    } else {
      responseText = "Hoàn toàn được! Vì đã có thông tin hồ sơ của bạn, chúng ta sẽ bắt đầu bước sàng lọc tiêu chí. **Hãy chọn các tiêu chí nghề nghiệp quan trọng nhất với bạn** ở bảng tiêu chí bên dưới (Ví dụ: Lương cao, Sáng tạo, Linh hoạt, Công nghệ...). Sau khi chọn xong, bạn hãy nhắn 'Đã chọn xong' nhé!";
      nextSubStage = 'CRITERIA_EVALUATION';
    }
  }
  // LISTING_CAREERS (User listed careers, check count)
  else if (subStage === 'LISTING_CAREERS') {
    // Parse list of careers
    const careers = userMessage.split(/[,;\n]/).map(c => c.trim()).filter(c => c.length > 0);
    
    // Save to userProposedCareers
    session.userProposedCareers = careers;
    
    if (careers.length < 3) {
      responseText = `Mình ghi nhận bạn đang quan tâm đến **${careers.length} ngành nghề do bạn tự đề xuất**: ${careers.map(c => `**${c}**`).join(', ')}.

Mặc dù chưa đủ 3 ngành nghề theo tiến trình đầy đủ, CareerAI vẫn sẽ giữ lại các lựa chọn này của bạn và chuyển tiếp sang **Giai đoạn 1: Sàng lọc tiêu chí** để tìm ra các bộ lọc phù hợp. Sau đó hệ thống sẽ gợi ý thêm để bạn tham khảo.

Hãy chọn các tiêu chí nghề nghiệp quan trọng nhất với bạn ở bảng tiêu chí bên dưới (Ví dụ: Lương cao, Sáng tạo, Linh hoạt, Công nghệ...). Sau khi chọn xong, bạn hãy nhắn 'Đã chọn xong' nhé!`;
      nextSubStage = 'CRITERIA_EVALUATION';
    } else {
      updatedShortlisted = careers;
      responseText = `Cảm ơn bạn. Mình đã lưu lại danh sách **${careers.length} nghề** bạn tự đề xuất:\n${careers.map((c, i) => `${i+1}. ${c}`).join('\n')}\n\n**Bạn có muốn hệ thống gợi ý thêm một số ngành nghề phù hợp khác** dựa trên sở thích và năng lực của bạn để tăng thêm lựa chọn không?`;
      nextSubStage = 'SUGGEST_MORE_QUESTION';
    }
  }
  // EXPLAIN_INSUFFICIENT_CAREERS (Handling response to insufficient careers)
  else if (subStage === 'EXPLAIN_INSUFFICIENT_CAREERS') {
    if (msgLower.includes('ai hỗ trợ') || msgLower.includes('gợi ý') || msgLower.includes('hồ sơ') || msgLower.includes('nhập thông tin') || msgLower.includes('chưa có')) {
      responseText = "Rất sẵn lòng! Vì đã có thông tin hồ sơ của bạn, chúng ta sẽ bắt đầu bước chọn tiêu chí. **Hãy chọn các tiêu chí nghề nghiệp quan trọng nhất với bạn** ở bảng tiêu chí. Sau khi chọn xong, bạn hãy nhắn 'Đã chọn xong' nhé!";
      nextSubStage = 'CRITERIA_EVALUATION';
    } else {
      // User typed more careers
      const careers = userMessage.split(/[,;\n]/).map(c => c.trim()).filter(c => c.length > 0);
      const combined = [...new Set([...(session.shortlistedCareers || []), ...careers])];
      if (combined.length < 3) {
        responseText = `Vẫn chưa đủ tối thiểu 3 nghề (hiện tại có ${combined.length} nghề: ${combined.join(', ')}). Bạn hãy ghi thêm nghề hoặc nhập "AI hỗ trợ" để hệ thống tự động gợi ý nhé!`;
        updatedShortlisted = combined;
      } else {
        updatedShortlisted = combined;
        responseText = `Đã nhận đủ! Danh sách của bạn gồm:\n${combined.map((c, i) => `${i+1}. ${c}`).join('\n')}\n\nBạn có muốn hệ thống gợi ý thêm ngành nghề khác nữa không?`;
        nextSubStage = 'SUGGEST_MORE_QUESTION';
      }
    }
  }
  // SUGGEST_MORE_QUESTION (Processing if user wants additional AI suggestions)
  else if (subStage === 'SUGGEST_MORE_QUESTION') {
    if (msgLower.includes('có') || msgLower.includes('yes') || msgLower.includes('muốn') || msgLower.includes('goi y')) {
      responseText = "Tuyệt vời! Vì đã có thông tin hồ sơ của bạn, chúng ta sẽ bắt đầu bước chọn tiêu chí. **Hãy chọn các tiêu chí nghề nghiệp quan trọng nhất với bạn** ở bảng tiêu chí. Sau khi chọn xong, bạn hãy nhắn 'Đã chọn xong' nhé!";
      nextSubStage = 'CRITERIA_EVALUATION';
    } else {
      // Proceed directly to GĐ 2
      nextStage = 'IN_DEPTH';
      nextSubStage = 'IN_DEPTH_EXPLORATION';
      responseText = `Tuyệt vời, chúng ta sẽ bắt đầu **Giai đoạn 2: Khám phá chuyên sâu** với danh sách nghề của bạn:\n${updatedShortlisted.map(c => `• **${c}**`).join('\n')}\n\nHệ thống sẽ cung cấp chi tiết về **xu hướng tuyển dụng, mức lương tham khảo, khoảng cách năng lực và phân tích thuận lợi/bất lợi** của từng nghề. Bạn đã sẵn sàng chưa?`;
    }
  }
  // CRITERIA_EVALUATION (Receiving criteria selection and suggesting careers)
  else if (subStage === 'CRITERIA_EVALUATION') {
    const profile = session.profileInfo || {};
    const barriers = profile.barriers || 'Không';
    const capabilities = profile.capabilities || 'Chưa rõ';
    const interests = profile.interests || 'Chưa rõ';
    const experience = profile.experience || 'Chưa rõ';
    const goals = profile.goals || 'Chưa rõ';
    const criteriaList = session.selectedCriteria || ['Mức thu nhập', 'Sáng tạo'];

    responseText = `### ⚖️ Áp dụng Mô hình Loại trừ Tuần tự (Sequential-Elimination Model)

Dựa trên thông tin hồ sơ của bạn và các điểm số khảo sát tiêu chí quan trọng, CareerAI đã tiến hành sàng lọc các ngành nghề qua 3 bộ lọc loại trừ cốt lõi:

1. **Bộ lọc 1: Loại bỏ theo Rào cản/Hạn chế khách quan (Objective Constraints):**
   * Ghi nhận rào cản: *"${barriers}"*.
   * *Đã loại bỏ:* Các nghề đòi hỏi di chuyển liên tục, đứng lâu hoặc thể chất nặng nhọc nếu có rào cản sức khỏe/địa lý/đi lại.
2. **Bộ lọc 2: Loại bỏ theo Năng lực cá nhân (Personal Competencies):**
   * Năng lực của bạn: *"${capabilities}"* (Học lực/Kinh nghiệm: *"${experience}"*).
   * *Đã loại bỏ:* Các nghề yêu cầu kỹ thuật/toán học chuyên sâu nếu bạn chưa tích lũy đủ hoặc năng lực mảng này ở mức thấp.
3. **Bộ lọc 3: Sắp xếp theo Sở thích cốt lõi (Core Preferences) & Mức độ quan trọng:**
   * Sở thích cốt lõi: *"${interests}"* / Mục tiêu: *"${goals}"*.
   * Tiêu chí ưu tiên đã chọn: **${criteriaList.join(', ')}**.

---

🌟 **Kết quả sau loại trừ: Top 5 ngành nghề triển vọng nhất dành cho bạn:**

1. **Kỹ sư Phần mềm (Software Engineer)**: Phù hợp nhất với năng lực tư duy logic/kỹ thuật, thỏa mãn tiêu chí thu nhập cao và làm việc văn phòng/remote linh hoạt (tránh được rào cản thể chất).
2. **Chuyên viên Marketing Số (Digital Marketer)**: Tận dụng tốt khả năng sáng tạo ý tưởng và giao tiếp, đáp ứng nhu cầu việc làm năng động.
3. **Nhà Thiết kế UX/UI (UX/UI Designer)**: Giao thoa hoàn hảo giữa năng lực sáng tạo mỹ thuật và ứng dụng kỹ thuật số, ít rào cản di chuyển vật lý.
4. **Chuyên viên Phân tích Dữ liệu (Data Analyst)**: Phù hợp với năng lực toán học/phân tích và mục tiêu thu nhập ổn định.
5. **Quản lý Sản phẩm Công nghệ (Product Manager)**: Tối ưu khả năng giao tiếp và định hướng chiến lược kinh doanh.

Bạn hãy chọn các ngành nghề mong muốn đưa vào **Danh sách rút gọn (Shortlist - tối đa 5 nghề)** ở bảng điều khiển bên phải/bên dưới, sau đó bấm xác nhận nhé!`;
    nextSubStage = 'SHORTLIST_CONFIRMATION';
  }
  // SHORTLIST_CONFIRMATION (Confirming the shortlist and moving to GĐ 2)
  else if (subStage === 'SHORTLIST_CONFIRMATION') {
    if (updatedShortlisted.length === 0) {
      updatedShortlisted = ['Kỹ sư Phần mềm', 'Digital Marketer', 'UX/UI Designer'];
    }
    responseText = `Đã lưu danh sách rút gọn gồm các nghề: **${updatedShortlisted.join(', ')}**.\n\nChúng ta cùng chuyển sang **Giai đoạn 2: Khám phá chuyên sâu**. Mình sẽ phân tích chi tiết xu hướng, mức lương, khoảng cách năng lực và ưu/nhược điểm của từng nghề đối với bạn. Bạn hãy bấm nút 'Xem chi tiết khám phá' hoặc nhắn 'Xem chi tiết' nhé!`;
    nextStage = 'IN_DEPTH';
    nextSubStage = 'IN_DEPTH_EXPLORATION';
  }
  // IN_DEPTH_EXPLORATION (Detailed information display)
  else if (subStage === 'IN_DEPTH_EXPLORATION') {
    const list = updatedShortlisted.length > 0 ? updatedShortlisted : ['Kỹ sư Phần mềm', 'Digital Marketer'];
    const profile = session.profileInfo || {};
    const barriers = profile.barriers || 'Không';
    const capabilities = profile.capabilities || 'Chưa rõ';
    const interests = profile.interests || 'Chưa rõ';
    const academic = profile.academic || 'Chưa rõ';
    const experience = profile.experience || 'Chưa rõ';
    const goals = profile.goals || 'Chưa rõ';

    // Helper: compute skill match level 0-10 from user capabilities string
    const matchSkill = (capLower, keywords, partialKeywords = []) => {
      for (const kw of keywords) {
        if (capLower.includes(kw.toLowerCase())) return 10;
      }
      for (const kw of partialKeywords) {
        if (capLower.includes(kw.toLowerCase())) return 5;
      }
      return 0;
    };

    const buildSkillGapLine = (skillList) => {
      return 'SKILLGAP::' + skillList.map(s => `${s.name}:${s.level}`).join('|');
    };

    const getCareerDetail = (c, userCap = '') => {
      const capLower = userCap.toLowerCase();

      if (c.toLowerCase().includes('phần mềm') || c.toLowerCase().includes('software')) {
        const skillList = [
          { name: 'Python',         level: matchSkill(capLower, ['python']) },
          { name: 'JavaScript',     level: matchSkill(capLower, ['javascript', 'js'], ['html', 'web']) },
          { name: 'Java',           level: matchSkill(capLower, ['java']) },
          { name: 'SQL',            level: matchSkill(capLower, ['sql', 'mysql', 'postgresql'], ['database', 'cơ sở dữ liệu']) },
          { name: 'Git',            level: matchSkill(capLower, ['git', 'github', 'gitlab']) },
          { name: 'React/Node.js',  level: matchSkill(capLower, ['react', 'node', 'nodejs'], ['javascript', 'js', 'frontend']) },
          { name: 'DevOps/Docker',  level: matchSkill(capLower, ['devops', 'docker', 'ci/cd', 'linux']) },
        ];
        return {
          description: "Lập trình, thiết kế và bảo trì các hệ thống phần mềm từ ứng dụng web, mobile đến hệ thống backend. Kỹ sư phần mềm phân tích yêu cầu, viết code, kiểm thử và triển khai sản phẩm theo quy trình Agile/Scrum.",
          typicalDay: "Sáng: standup meeting (15 phút), code feature mới hoặc fix bug. Trưa: review code của đồng nghiệp. Chiều: làm việc với tester/designer hoặc viết tài liệu kỹ thuật. Cuối ngày: cập nhật tiến độ lên Jira/Trello.",
          coreAspects: "Ngồi làm việc với máy tính 8-10h/ngày, áp lực tiến độ (deadline) và OT cao, công nghệ thay đổi liên tục đòi hỏi tự học suốt đời.",
          salary: "15 - 35 triệu VNĐ/tháng (khởi điểm), Tech Lead có thể lên tới 50+ triệu VNĐ/tháng.",
          prospects: "Lộ trình: Junior → Senior (2-4 năm) → Tech Lead/Architect (5-8 năm) → CTO hoặc chuyển Product Manager. Cơ hội làm remote/offshore cho công ty nước ngoài với mức lương USD rất cao.",
          skillGapLine: buildSkillGapLine(skillList),
          skillGap: "Cần tích lũy thêm các dự án thực tế trên GitHub, bổ sung kiến thức về quy trình DevOps và các Framework chuyên môn (React, Node.js).",
          jobOpportunities: "Nhu cầu tuyển dụng rất cao: TopCV ghi nhận hơn 15.000 tin tuyển dụng/tháng. Mức độ cạnh tranh cao nhưng nhân sự chất lượng luôn thiếu. Đặc biệt hot tại TP.HCM, Hà Nội và các khu công nghệ.",
          feasibility: "Khá cao. Khớp với năng lực kỹ thuật của bạn và hoàn toàn tránh được các rào cản di chuyển thể chất nhờ cơ chế làm việc remote."
        };
      }
      if (c.toLowerCase().includes('marketing') || c.toLowerCase().includes('marketer')) {
        const skillList = [
          { name: 'Facebook Ads',   level: matchSkill(capLower, ['facebook ads', 'fb ads', 'facebook'], ['quảng cáo', 'ads']) },
          { name: 'Google Ads',     level: matchSkill(capLower, ['google ads', 'google adwords'], ['quảng cáo', 'ads', 'sem']) },
          { name: 'SEO/SEM',        level: matchSkill(capLower, ['seo', 'sem', 'search engine'], ['marketing', 'digital']) },
          { name: 'Content Writing',level: matchSkill(capLower, ['content', 'copywriting', 'viết content'], ['viết', 'sáng tạo']) },
          { name: 'Google Analytics',level: matchSkill(capLower, ['google analytics', 'ga4', 'analytics'], ['data', 'phân tích']) },
          { name: 'Email Marketing',level: matchSkill(capLower, ['email marketing', 'mailchimp'], ['email', 'marketing']) },
          { name: 'A/B Testing',    level: matchSkill(capLower, ['a/b test', 'ab test', 'a/b testing'], ['test', 'tối ưu']) },
        ];
        return {
          description: "Lập kế hoạch và triển khai các chiến dịch marketing trên nền tảng số (Facebook, Google, TikTok, Email...). Phân tích hiệu quả quảng cáo, tối ưu ngân sách và xây dựng thương hiệu doanh nghiệp trực tuyến.",
          typicalDay: "Sáng: kiểm tra chỉ số quảng cáo (CTR, CPC, ROAS) và tối ưu campaign. Trưa: họp với team Content để lên ý tưởng. Chiều: viết báo cáo hiệu quả tuần, lên kế hoạch chiến dịch mới. Cuối ngày: theo dõi A/B test.",
          coreAspects: "Chịu áp lực KPI doanh số/traffic khắt khe, thị trường biến động nhanh, thường xuyên làm việc ngoài giờ để tối ưu chạy chiến dịch quảng cáo.",
          salary: "12 - 25 triệu VNĐ/tháng, tăng theo năng lực quản lý ngân sách.",
          prospects: "Lộ trình: Executive → Senior (2-3 năm) → Marketing Manager (4-6 năm) → CMO hoặc tự mở agency riêng. Cơ hội freelance và làm việc với thương hiệu quốc tế rất rộng mở.",
          skillGapLine: buildSkillGapLine(skillList),
          skillGap: "Cần cải thiện tư duy tối ưu chi phí quảng cáo (A/B testing), kỹ năng phân tích hành vi khách hàng bằng dữ liệu.",
          jobOpportunities: "Nhu cầu tuyển dụng ổn định: khoảng 8.000-10.000 tin/tháng trên VietnamWorks. Cạnh tranh trung bình, ứng viên có kỹ năng data-driven marketing đang rất được ưa chuộng.",
          feasibility: "Tốt. Phù hợp với sở thích sáng tạo và khả năng giao tiếp của bạn."
        };
      }
      if (c.toLowerCase().includes('thiết kế') || c.toLowerCase().includes('designer') || c.toLowerCase().includes('ux/ui')) {
        const skillList = [
          { name: 'Figma',          level: matchSkill(capLower, ['figma'], ['thiết kế', 'design']) },
          { name: 'Adobe XD',       level: matchSkill(capLower, ['adobe xd', 'adobe', 'xd'], ['thiết kế', 'design']) },
          { name: 'User Research',  level: matchSkill(capLower, ['user research', 'ux research', 'nghiên cứu người dùng'], ['research', 'nghiên cứu']) },
          { name: 'Wireframing',    level: matchSkill(capLower, ['wireframe', 'wireframing', 'prototype'], ['thiết kế', 'figma']) },
          { name: 'HTML/CSS',       level: matchSkill(capLower, ['html', 'css'], ['web', 'frontend']) },
          { name: 'Design System',  level: matchSkill(capLower, ['design system', 'component'], ['figma', 'adobe']) },
          { name: 'Photoshop/AI',   level: matchSkill(capLower, ['photoshop', 'illustrator', 'adobe ai'], ['adobe', 'thiết kế đồ họa']) },
        ];
        return {
          description: "Nghiên cứu hành vi người dùng, thiết kế giao diện (UI) và trải nghiệm sử dụng (UX) cho các sản phẩm số (app, website, phần mềm). Tạo wireframe, prototype và làm việc chặt chẽ với team phát triển.",
          typicalDay: "Sáng: phỏng vấn người dùng hoặc phân tích heatmap/feedback. Trưa: thiết kế wireframe/mockup trên Figma. Chiều: trình bày thiết kế với PM và Developer để nhận feedback. Tối: chỉnh sửa và bàn giao file.",
          coreAspects: "Cân bằng giữa thẩm mỹ cá nhân và trải nghiệm của người dùng thực tế, nhận phản hồi và chỉnh sửa thiết kế liên tục từ khách hàng/PM.",
          salary: "14 - 28 triệu VNĐ/tháng.",
          prospects: "Lộ trình: Junior Designer → Senior UX/UI (3-5 năm) → Lead Designer → UX Director hoặc Product Designer tại các công ty lớn. Cơ hội làm freelance với dự án quốc tế rất cao.",
          skillGapLine: buildSkillGapLine(skillList),
          skillGap: "Cần xây dựng Portfolio sản phẩm thực tế hoàn chỉnh, bổ sung kiến thức cơ bản về HTML/CSS để làm việc cùng Developer.",
          jobOpportunities: "Nhu cầu tăng nhanh: khoảng 5.000-7.000 tin tuyển dụng/tháng. Startup và công ty công nghệ đặc biệt có nhu cầu cao, ưu tiên ứng viên có portfolio thực tế ấn tượng.",
          feasibility: "Cao. Phát huy tốt sự sáng tạo và kỹ năng kỹ thuật thiết kế của bạn."
        };
      }
      if (c.toLowerCase().includes('dữ liệu') || c.toLowerCase().includes('data')) {
        const skillList = [
          { name: 'Python',         level: matchSkill(capLower, ['python'], ['lập trình', 'programming']) },
          { name: 'SQL',            level: matchSkill(capLower, ['sql', 'mysql', 'postgresql'], ['database', 'cơ sở dữ liệu']) },
          { name: 'Power BI',       level: matchSkill(capLower, ['power bi', 'powerbi'], ['bi', 'dashboard', 'báo cáo']) },
          { name: 'Excel nâng cao', level: matchSkill(capLower, ['excel', 'spreadsheet'], ['bảng tính', 'văn phòng']) },
          { name: 'Tableau',        level: matchSkill(capLower, ['tableau'], ['power bi', 'visualization', 'trực quan']) },
          { name: 'Statistics',     level: matchSkill(capLower, ['thống kê', 'statistics', 'xác suất'], ['toán', 'mathematics']) },
          { name: 'Machine Learning',level: matchSkill(capLower, ['machine learning', 'ml', 'ai', 'deep learning'], ['python', 'data science']) },
        ];
        return {
          description: "Thu thập, làm sạch, phân tích và trực quan hóa dữ liệu để tạo ra các insight hỗ trợ quyết định kinh doanh. Data Analyst làm việc với SQL, Python và các công cụ BI như Power BI, Tableau.",
          typicalDay: "Sáng: trích xuất và làm sạch dữ liệu từ database (SQL). Trưa: xây dựng báo cáo/dashboard trên Power BI. Chiều: phân tích xu hướng và trình bày insight với ban quản lý. Cuối ngày: tự động hóa báo cáo định kỳ.",
          coreAspects: "Làm việc chi tiết với các bảng số liệu khổng lồ, đòi hỏi tính tỉ mỉ chính xác tuyệt đối, kỹ năng thuyết trình truyền tải insight phức tạp thành đơn giản.",
          salary: "15 - 30 triệu VNĐ/tháng.",
          prospects: "Lộ trình: Junior Analyst → Senior Analyst (2-4 năm) → Data Scientist/ML Engineer hoặc Business Intelligence Manager (5-7 năm). Ngành tài chính, ngân hàng và e-commerce trả lương rất cạnh tranh.",
          skillGapLine: buildSkillGapLine(skillList),
          skillGap: "Cần cải thiện tư duy phân tích bài toán kinh doanh thực tế (Business Domain Knowledge), kỹ năng làm sạch dữ liệu lớn.",
          jobOpportunities: "Nhu cầu rất cao và tiếp tục tăng: hơn 6.000 tin/tháng, tập trung nhiều ở lĩnh vực Fintech, E-commerce và FMCG. Nhân sự giỏi SQL + Python đang được săn đón mạnh.",
          feasibility: "Khá tốt. Tận dụng được tư duy phân tích số liệu."
        };
      }
      if (c.toLowerCase().includes('quản lý sản phẩm') || c.toLowerCase().includes('product manager')) {
        const skillList = [
          { name: 'Agile/Scrum',    level: matchSkill(capLower, ['agile', 'scrum', 'kanban'], ['quản lý dự án', 'project']) },
          { name: 'SQL/Data',       level: matchSkill(capLower, ['sql', 'data', 'phân tích dữ liệu'], ['excel', 'báo cáo']) },
          { name: 'Roadmapping',    level: matchSkill(capLower, ['roadmap', 'lộ trình sản phẩm'], ['kế hoạch', 'chiến lược']) },
          { name: 'Communication',  level: matchSkill(capLower, ['giao tiếp', 'communication', 'thuyết trình'], ['leadership', 'lãnh đạo']) },
          { name: 'UX Thinking',    level: matchSkill(capLower, ['ux', 'user experience', 'trải nghiệm người dùng'], ['thiết kế', 'design']) },
          { name: 'Tech Basics',    level: matchSkill(capLower, ['lập trình', 'code', 'python', 'javascript'], ['kỹ thuật', 'phần mềm']) },
          { name: 'Market Research',level: matchSkill(capLower, ['market research', 'nghiên cứu thị trường'], ['research', 'marketing']) },
        ];
        return {
          description: "Định hướng chiến lược và quản lý vòng đời sản phẩm từ ý tưởng đến ra mắt. Product Manager phối hợp giữa các bộ phận Kỹ thuật, Thiết kế và Kinh doanh để đảm bảo sản phẩm đáp ứng nhu cầu thị trường và mục tiêu doanh nghiệp.",
          typicalDay: "Sáng: standup với team Engineering và Design. Trưa: phân tích dữ liệu người dùng và xác định tính năng ưu tiên. Chiều: viết PRD (Product Requirements Document) và trình bày với stakeholder. Cuối ngày: theo dõi roadmap và giải quyết blockers.",
          coreAspects: "Chịu trách nhiệm về sự thành bại của sản phẩm nhưng không có quyền lực quản trị nhân sự trực tiếp; họp hành liên tục, giao tiếp điều phối giữa Tech, Business và Design.",
          salary: "20 - 45 triệu VNĐ/tháng.",
          prospects: "Lộ trình: Associate PM → PM (2-3 năm) → Senior PM → Director of Product → CPO. Đây là một trong những vị trí có mức tăng lương và thăng tiến nhanh nhất trong ngành công nghệ.",
          skillGapLine: buildSkillGapLine(skillList),
          skillGap: "Cần bổ sung kiến thức nền tảng về phát triển phần mềm, kỹ năng giải quyết xung đột ý kiến giữa các phòng ban.",
          jobOpportunities: "Nhu cầu đang tăng mạnh tại các công ty Tech và Startup: khoảng 2.000-3.000 tin/tháng. Vị trí cạnh tranh cao, ưu tiên ứng viên có nền tảng kỹ thuật hoặc kinh nghiệm thực tế về sản phẩm.",
          feasibility: "Trung bình khá. Cần bồi dưỡng thêm kỹ năng mềm điều phối nhóm."
        };
      }
      // Default fallback
      const defaultSkills = [
        { name: 'Kỹ năng chuyên môn', level: matchSkill(capLower, ['chuyên môn', 'kinh nghiệm'], []) },
        { name: 'Giao tiếp',          level: matchSkill(capLower, ['giao tiếp', 'communication'], ['thuyết trình']) },
        { name: 'Tin học văn phòng',  level: matchSkill(capLower, ['excel', 'word', 'powerpoint', 'tin học'], ['máy tính']) },
        { name: 'Ngoại ngữ',          level: matchSkill(capLower, ['tiếng anh', 'english', 'ngoại ngữ'], ['ielts', 'toeic']) },
        { name: 'Tự học/Nghiên cứu',  level: matchSkill(capLower, ['tự học', 'nghiên cứu', 'học hỏi'], ['đọc sách', 'khóa học']) },
      ];
      return {
        description: "Ứng dụng kiến thức chuyên ngành để giải quyết các bài toán thực tế, phối hợp với các bộ phận liên quan và đóng góp vào mục tiêu chung của tổ chức.",
        typicalDay: "Thực hiện các nhiệm vụ chuyên môn theo kế hoạch, họp với team để cập nhật tiến độ, xử lý các vấn đề phát sinh và báo cáo kết quả cho quản lý.",
        coreAspects: "Đòi hỏi tính kiên trì học hỏi công cụ chuyên ngành, phối hợp làm việc nhóm và giao tiếp tốt dưới áp lực.",
        salary: "12 - 22 triệu VNĐ/tháng.",
        prospects: "Lộ trình phát triển từ vị trí thực tập/fresher lên chuyên viên, senior và quản lý trong vòng 4-7 năm tùy nỗ lực và môi trường làm việc.",
        skillGapLine: buildSkillGapLine(defaultSkills),
        skillGap: "Cần bồi dưỡng portfolio dự án cá nhân thực tế để chứng minh năng lực với nhà tuyển dụng.",
        jobOpportunities: "Nhu cầu tuyển dụng ổn định và tăng đều theo sự phát triển của nền kinh tế số tại Việt Nam.",
        feasibility: "Khá khả thi. Khớp với mục tiêu phát triển bản thân của bạn."
      };
    };

    responseText = `## 🔍 Giai đoạn 2: Khám phá chuyên sâu (In-depth Exploration)

Chào bạn, tại giai đoạn này chúng ta sẽ **"phóng to" (Zoom-in)** vào từng nghề nghiệp thuộc danh sách rút gọn để kiểm chứng thông qua **2 tiêu chuẩn bắt buộc**: **Tính phù hợp (Fit)** và **Tính khả thi (Feasibility & Skill Gap)**.

---
` + 
    list.map((c, i) => {
      const d = getCareerDetail(c, capabilities);
      return `### 💼 Nghề nghiệp thứ ${i+1}: **${c}**

#### 📋 1. Mô tả công việc:
${d.description}

#### 🌅 2. Một ngày làm việc điển hình:
${d.typicalDay}

#### 💰 3. Mức lương tham khảo:
${d.salary}

#### 🚀 4. Triển vọng nghề nghiệp:
${d.prospects}

#### 🛠️ 5. Kỹ năng cần có:
${d.skillGapLine}
* **Ghi chú:** Năng lực hiện tại của bạn: *"${capabilities}"* — Trình độ: *"${academic}"*, Kinh nghiệm: *"${experience}"*.
* **Khoảng cách kỹ năng cần bù đắp:** ${d.skillGap}

#### 🏢 6. Cơ hội việc làm tại Việt Nam:
${d.jobOpportunities}

#### 📌 7. Khía cạnh cốt lõi của nghề (Core aspects):
* **Đặc thù bắt buộc:** ${d.coreAspects}
* **Đánh giá rào cản:** Rào cản ghi nhận: *"${barriers}"*. Nghề này được đánh giá là ít/có thể khắc phục bởi rào cản trên.

⚖️ **Phán quyết sơ bộ:** **${d.feasibility}**
*(Nếu bạn sẵn lòng chấp nhận các "Khía cạnh cốt lõi" của nghề, hãy giữ lại cho Giai đoạn 3: Lựa chọn)*`;
    }).join('\n\n---\n\n') + 
    `\n\nBạn có thể đặt thêm câu hỏi tự do cho AI về các phân tích trên. Khi đã sẵn sàng, hãy bấm nút **"Chuyển sang Giai đoạn 3"** ở bảng điều khiển bên dưới để lập Ma trận quyết định nhé!`;

    nextStage = 'IN_DEPTH';
    nextSubStage = 'IN_DEPTH_CHAT';
  }
  // IN_DEPTH_CHAT (Conversational QA during GĐ 2, transitioning to GĐ 3)
  else if (subStage === 'IN_DEPTH_CHAT') {
    if (msgLower.includes('chuyển sang') || msgLower.includes('giai đoạn 3') || msgLower.includes('lựa chọn') || msgLower.includes('tiếp tục') || msgLower.includes('ready') || msgLower.includes('sẵn sàng')) {
      const list = updatedShortlisted.length > 0 ? updatedShortlisted : ['Kỹ sư Phần mềm', 'Digital Marketer', 'UX/UI Designer'];
      
      responseText = `## 🎯 Giai đoạn 3: Lựa chọn (Choice)
      
Chào mừng bạn đến với bước cuối cùng trong mô hình PIC. Chúng ta sẽ tiến hành so sánh, đối chiếu kết quả xếp hạng logic của hệ thống với **trực giác (intuition)** của bạn để đưa ra quyết định vững vàng nhất.

### 📊 Ma trận quyết định (Decision Matrix) so sánh mức độ phù hợp:

| Hạng | Nghề nghiệp | Tiêu chí phù hợp | Cơ hội thị trường | Mức độ hứng thú | **Điểm tổng hợp** |
| :---: | :--- | :---: | :---: | :---: | :---: |
` + 
      list.map((c, idx) => {
        let score = (9.5 - idx * 0.4).toFixed(1);
        let starsFit = "⭐⭐⭐⭐⭐";
        let starsMarket = "⭐⭐⭐⭐⭐";
        let starsInterest = "⭐⭐⭐⭐";
        return `| ${idx+1} | ${c} | ${starsFit} | ${starsMarket} | ${starsInterest} | **${score}/10** |`;
      }).join('\n') + `

Bạn hãy nhận xét xem bảng xếp hạng logic này có khớp với **trực giác/mong muốn thực tế** của bạn không? Bạn hãy click chọn nghề nghiệp mục tiêu chính thức bên dưới để bắt đầu lập lộ trình chi tiết nhé!`;

      nextStage = 'CHOICE';
      nextSubStage = 'CHOICE_SELECTION';
    } else {
      // Free text conversation during Stage 2: let the model reply in normal flow
      nextStage = 'IN_DEPTH';
      nextSubStage = 'IN_DEPTH_CHAT';
      responseText = `Đó là một câu hỏi rất hay liên quan đến các ngành nghề trong shortlist của bạn. Bạn hãy tìm hiểu thêm hoặc bấm nút **"Chuyển sang Giai đoạn 3: Lựa chọn nghề"** bất kỳ lúc nào để bắt đầu so sánh bằng Ma trận quyết định nhé!`;
    }
  }
  // CHOICE_SELECTION (Matrix comparison and selecting target career)
  else if (subStage === 'CHOICE_SELECTION') {
    if (msgLower.includes('mâu thuẫn') || msgLower.includes('không khớp') || msgLower.includes('điều chỉnh các tiêu chí') || msgLower.includes('rà soát') || msgLower.includes('quay lại')) {
      responseText = `Tôi rất hiểu cảm giác này. Sự mâu thuẫn (incongruity) giữa trực giác cá nhân và kết quả xếp hạng logic của hệ thống là một hiện tượng rất phổ biến trong hướng nghiệp. Theo mô hình PIC, đây chính là lúc chúng ta cần rà soát lại toàn bộ quá trình ra quyết định.

Bạn hãy **quay lại bảng khảo sát tiêu chí** ở bảng điều khiển bên dưới để điều chỉnh mức độ quan trọng (kéo thanh trượt) hoặc thay đổi danh sách tiêu chí ban đầu. Hệ thống sẽ tự động cập nhật và tính toán lại bảng xếp hạng phù hợp nhất cho bạn để dung hòa lý trí và trực giác!`;
      nextStage = 'PRESCREENING';
      nextSubStage = 'CRITERIA_EVALUATION';
    } else if (msgLower.includes('khớp với trực giác') || msgLower.includes('trùng khớp')) {
      responseText = `Tuyệt vời! Sự trùng khớp hoàn hảo giữa trực giác (intuition) và kết quả phân tích hệ thống (system logic) giúp củng cố mạnh mẽ sự tự tin và tin tưởng của bạn vào quyết định nghề nghiệp này.

Bây giờ, **hãy click chọn ngành nghề mục tiêu chính thức** của bạn ở bảng điều khiển bên dưới để bắt đầu thiết kế lộ trình học tập cá nhân hóa 6-12 tháng nhé!`;
    } else {
      const list = updatedShortlisted.length > 0 ? updatedShortlisted : ['Kỹ sư Phần mềm', 'Digital Marketer', 'UX/UI Designer'];
      
      responseText = `## 🎯 Giai đoạn 3: Lựa chọn (Choice)

Chào bạn, đây là bước cuối cùng trong mô hình PIC. Chúng ta sẽ tiến hành so sánh, đối chiếu kết quả xếp hạng logic của hệ thống với **trực giác (intuition)** của bạn để đưa ra quyết định vững vàng nhất.

### 📊 Ma trận quyết định (Decision Matrix) so sánh mức độ phù hợp:

| Hạng | Nghề nghiệp | Tiêu chí phù hợp | Cơ hội thị trường | Mức độ hứng thú | **Điểm tổng hợp** |
| :---: | :--- | :---: | :---: | :---: | :---: |
` + 
      list.map((c, idx) => {
        let score = (9.5 - idx * 0.4).toFixed(1);
        let starsFit = "⭐⭐⭐⭐⭐";
        let starsMarket = "⭐⭐⭐⭐⭐";
        let starsInterest = "⭐⭐⭐⭐";
        if (idx === 1) { starsFit = "⭐⭐⭐⭐"; starsMarket = "⭐⭐⭐⭐"; starsInterest = "⭐⭐⭐⭐⭐"; }
        if (idx === 2) { starsFit = "⭐⭐⭐⭐"; starsMarket = "⭐⭐⭐⭐"; starsInterest = "⭐⭐⭐⭐"; }
        return `| **#${idx+1}** | **${c}** | ${starsFit} | ${starsMarket} | ${starsInterest} | **${score}/10** |`;
      }).join('\n') + 
      `

### 🔍 Giải thích logic của AI (Explainable AI - XAI):
` + 
      list.map((c, idx) => {
        let explanation = "";
        const cLower = c.toLowerCase();
        if (cLower.includes('phần mềm') || cLower.includes('software')) {
          explanation = `Phù hợp xuất sắc với năng lực kỹ thuật và giải quyết được rào cản thể chất (nhờ cơ chế remote). Đạt điểm tối đa về mong muốn thu nhập cao.`;
        } else if (cLower.includes('marketing') || cLower.includes('marketer')) {
          explanation = `Tận dụng tối đa sở thích sáng tạo và khả năng giao tiếp của bạn. Điểm hứng thú cao nhưng cơ hội thị trường cạnh tranh gay gắt hơn.`;
        } else if (cLower.includes('thiết kế') || cLower.includes('designer') || cLower.includes('ux/ui')) {
          explanation = `Giao thoa tốt giữa khả năng sáng tạo mỹ thuật và kỹ năng kỹ thuật thiết kế số, ít rào cản vật lý.`;
        } else {
          explanation = `Khớp khá tốt với các tiêu chí ưu tiên của bạn, cung cấp lộ trình phát triển năng lực ổn định.`;
        }
        return `${idx+1}. **${c}**: ${explanation}`;
      }).join('\n');
    }
    nextSubStage = 'GENERATE_ROADMAP';
  }
  // GENERATE_ROADMAP (Creating customized roadmap)
  else if (subStage === 'GENERATE_ROADMAP') {
    const chosen = session.selectedCareer || 'Kỹ sư Phần mềm';
    
    // Generate simulated roadmap object
    if (chosen === 'Kỹ sư Phần mềm') {
      updatedRoadmap = {
        careerName: "Kỹ sư Phần mềm (Software Engineer)",
        summary: "Lập trình và thiết kế hệ thống phần mềm chuyên nghiệp. Phù hợp với mục tiêu thăng tiến và mức lương tốt của bạn.",
        milestones: [
          { phase: "Giai đoạn 1 (Tháng 1-3): Nền tảng cấu trúc dữ liệu & Thuật toán", desc: "Học cấu trúc dữ liệu, thuật toán cơ bản, ngôn ngữ JavaScript/Python." },
          { phase: "Giai đoạn 2 (Tháng 4-6): Phát triển ứng dụng Web chuyên sâu", desc: "Học HTML/CSS nâng cao, ReactJS hoặc VueJS, thiết kế API RESTful và SQL." },
          { phase: "Giai đoạn 3 (Tháng 7-12): Dự án thực hành & Thực tập doanh nghiệp", desc: "Hoàn thiện 2 dự án cá nhân trên GitHub, thực tập tại các công ty công nghệ." }
        ],
        courses: [
          { title: "JavaScript Algorithms and Data Structures", provider: "freeCodeCamp" },
          { title: "React - The Complete Guide (incl. React Router, Redux)", provider: "Udemy (Academind)" },
          { title: "CS50's Introduction to Computer Science", provider: "Harvard University (edX)" }
        ],
        certificates: [
          "Meta Front-End Developer Professional Certificate",
          "AWS Certified Cloud Practitioner"
        ]
      };
    } else {
      updatedRoadmap = {
        careerName: `Chuyên viên ${chosen}`,
        summary: `Lộ trình phát triển năng lực toàn diện cho nghề ${chosen} tối ưu theo hồ sơ cá nhân.`,
        milestones: [
          { phase: "Giai đoạn 1 (Tháng 1-3): Tư duy căn bản & Kiến thức nền tảng", desc: `Tìm hiểu các khái niệm cơ bản về nghề ${chosen} và công cụ cần thiết.` },
          { phase: "Giai đoạn 2 (Tháng 4-6): Thực hành công cụ chuyên môn", desc: "Thực hành sử dụng các phần mềm, công cụ hỗ trợ và phân tích dữ liệu chuyên ngành." },
          { phase: "Giai đoạn 3 (Tháng 7-12): Xây dựng Portfolio & Dự án thực tế", desc: "Tham gia các dự án mẫu, thực tập bán thời gian để tích lũy kinh nghiệm cọ xát thực tế." }
        ],
        courses: [
          { title: `Introduction to ${chosen} Specialization`, provider: "Coursera" },
          { title: `Complete ${chosen} bootcamp 2026`, provider: "Udemy" }
        ],
        certificates: [
          `Google Professional Certificate for ${chosen}`,
          `Professional Industry Certification`
        ]
      };
    }

    responseText = `Lộ trình phát triển năng lực cá nhân hóa cho mục tiêu **${chosen}** đã được thiết lập thành công!\n\nBạn có thể sang tab **Bảng lộ trình** để xem chi tiết lộ trình 6-12 tháng, bao gồm danh sách các khóa học trực tuyến cụ thể và chứng chỉ cần thiết.\n\nNgoài ra, bạn có muốn **kết nối với chuyên gia hướng nghiệp** để nhận thêm lời khuyên bổ sung, hay bạn muốn tự điều chỉnh lộ trình học tập này?`;
    nextSubStage = 'ROADMAP_DECISION';
  }
  // ROADMAP_DECISION (Processing connection request or adjustments)
  else if (subStage === 'ROADMAP_DECISION') {
    if (msgLower.includes('chuyên gia') || msgLower.includes('kết nối') || msgLower.includes('tu van') || session.expertConsulted) {
      responseText = `[Hệ thống]: Yêu cầu kết nối chuyên gia đã được gửi đi.\n\n**Chuyên gia Hướng nghiệp (Thầy Nguyễn Văn A)** đã tham gia phiên tư vấn:\n\n*"Chào em! Lộ trình Kỹ sư Phần mềm của em thiết kế rất bài bản. Tuy nhiên, thầy khuyên em ở Giai đoạn 2 nên tập trung học thêm về **Docker và Git/GitHub nâng cao** vì các doanh nghiệp tuyển thực tập sinh hiện nay đòi hỏi kỹ năng làm việc nhóm trên Git rất cao. Ở Giai đoạn 3, em hãy đăng ký thực tập sớm từ tháng thứ 8 để cọ xát thực tế thay vì đợi đến tháng thứ 10 nhé."*\n\nBạn có muốn điều chỉnh lộ trình theo ý kiến chuyên gia không?`;
      nextSubStage = 'ROADMAP_ADJUSTMENT';
    } else {
      responseText = `Bạn có thể chọn **Điều chỉnh lộ trình** nếu muốn sửa đổi khóa học, hoặc bấm **Xác nhận thực hiện và cập nhật tiến độ** để bắt đầu ghi nhận tiến trình học tập của mình nhé!`;
      nextSubStage = 'ROADMAP_ADJUSTMENT';
    }
  }
  // ROADMAP_ADJUSTMENT (Loops back or confirms)
  else if (subStage === 'ROADMAP_ADJUSTMENT') {
    if (msgLower.includes('điều chỉnh') || msgLower.includes('sửa') || msgLower.includes('thay đổi') || msgLower.includes('doi nganh')) {
      responseText = "Rất sẵn lòng. Bạn muốn điều chỉnh khía cạnh nào? Bạn có thể đổi sang nghề nghiệp khác hoặc thay đổi các tiêu chí ban đầu. Hãy cho mình biết nhé!";
      nextStage = 'CHOICE';
      nextSubStage = 'CHOICE_SELECTION';
    } else {
      responseText = `Lịch sử tư vấn và lộ trình học tập của bạn đã được ghi nhận thành công! Hệ thống đã kích hoạt tính năng **Theo dõi tiến độ học tập**. \n\nChúc bạn gặt hái nhiều thành công trên con đường trở thành **${session.selectedCareer || 'Kỹ sư Phần mềm'}** thực thụ. CareerAI rất tự hào được đồng hành cùng bạn!`;
      nextStage = 'COMPLETED';
      nextSubStage = 'COMPLETED';
    }
  } else {
    responseText = "CareerAI luôn sẵn sàng hỗ trợ bạn. Bạn có thể làm mới phiên tư vấn bất cứ lúc nào để bắt đầu hành trình mới!";
  }

  return {
    text: responseText,
    stage: nextStage,
    subStage: nextSubStage,
    shortlistedCareers: updatedShortlisted,
    finalRoadmap: updatedRoadmap,
    isSimulated: true
  };
}

module.exports = {
  getAICounselorResponse
};

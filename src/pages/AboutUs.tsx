import React, { useEffect, useRef } from 'react';

export const AboutUs: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) =>
      observerRef.current?.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#cc0000] px-6">
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-white/5 border border-white/10" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-white/5 border border-white/10" />

        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
          <span className="text-white/60 tracking-[0.4em] uppercase text-xs font-bold border border-white/20 px-4 py-1.5 rounded-full">
            Cộng đồng Fan Fairy TAIL Việt Nam
          </span>

          <h1 className="text-white text-5xl sm:text-7xl md:text-8xl font-black leading-tight tracking-tight">
            Chúng mình là
            <span className="block text-yellow-300">...</span>
          </h1>

          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm shadow-2xl overflow-hidden">
              <img src="/logo-icon.png" alt="Fairy Tail Việt Nam Logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-yellow-300 text-xl sm:text-2xl font-bold italic tracking-wide drop-shadow-lg">
              "Sáng tạo không ngừng!"
            </p>
            <p className="text-white/70 text-base font-medium">Fairy Tail Việt Nam</p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 animate-bounce opacity-60">
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">Cuộn xuống</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT SECTION  (ảnh 2)
      ══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out text-center mb-16">
            <span className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.4em] mb-3 block">Giới thiệu</span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
              Tổng quan về <span className="text-[#cc0000]">Fairy Tail Việt Nam</span>
            </h2>
            <div className="w-16 h-1 bg-[#cc0000] mx-auto mt-5 rounded-full" />
          </div>

          {/* Ảnh 2 — full width, đã có nội dung bên trong */}
          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out delay-100 group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-50">
              <img
                src="/About us/2.jpg"
                alt="Tổng quan về Fairy Tail Việt Nam"
                className="w-full object-contain group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#cc0000]" />
            </div>
            <p className="mt-3 text-center text-xs text-gray-400 italic">
              📸 Ảnh cosplay từ sự kiện Fairy Tail Fest 2025 — Photographer: FTVNTeam
            </p>
          </div>

          {/* Stats row */}
          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out delay-200 grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100">
            {[
              { val: '5000+', label: 'Thành viên' },
              { val: '3+', label: 'Năm hoạt động' },
              { val: '20+', label: 'Sự kiện' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <span className="block text-2xl font-black text-[#cc0000]">{s.val}</span>
                <span className="block text-xs text-gray-500 mt-0.5 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SỰ KIỆN  (ảnh 3 & 4)
      ══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out text-center mb-14">
            <span className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.4em] mb-3 block">Hoạt động</span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
              Sự kiện của <span className="text-[#cc0000]">chúng mình</span>
            </h2>
            <div className="w-16 h-1 bg-[#cc0000] mx-auto mt-5 rounded-full" />
            <p className="text-gray-500 mt-5 max-w-xl mx-auto text-base">
              Những khoảnh khắc đáng nhớ trong hành trình xây dựng cộng đồng Fairy Tail Việt Nam.
            </p>
          </div>

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out delay-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['/About us/3.jpg', '/About us/4.jpg'].map((src, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer">
                <img
                  src={src}
                  alt={`Sự kiện ${idx + 1}`}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#cc0000]/0 group-hover:bg-[#cc0000]/25 transition-colors duration-300 flex items-end p-5">
                  <span className="text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    Sự kiện {idx + 3}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DỰ ÁN — TIMELINE  (ảnh 5 – 8)
      ══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out text-center mb-20">
            <span className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.4em] mb-3 block">Hành trình</span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
              Dự án của <span className="text-[#cc0000]">chúng mình</span>
            </h2>
            <div className="w-16 h-1 bg-[#cc0000] mx-auto mt-5 rounded-full" />
            <p className="text-gray-500 mt-5 max-w-xl mx-auto text-base">
              Hành trình từ những dự án đầu tiên đến tầm nhìn tương lai — mỗi mốc thời gian là một bước tiến của cộng đồng.
            </p>
          </div>

          {/* Timeline container */}
          <div className="relative">
            {/* Center vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#cc0000]/80 via-[#cc0000]/40 to-transparent -translate-x-1/2 hidden sm:block" />

            {/* ── 2022 – 2023 ── */}
            <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out relative flex flex-col sm:flex-row items-center gap-8 mb-20">
              {/* Image — left */}
              <div className="w-full sm:w-[45%] group relative overflow-hidden rounded-2xl shadow-xl">
                <img src="/About us/5.jpg" alt="Lịch Fairy Tail Chibi & Tứ Quý" className="w-full object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-in-out" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#cc0000]" />
              </div>

              {/* Center dot */}
              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 flex-col items-center gap-1 z-10">
                <div className="w-5 h-5 rounded-full bg-[#cc0000] border-4 border-white shadow-lg ring-2 ring-[#cc0000]/30" />
              </div>

              {/* Text — right */}
              <div className="w-full sm:w-[45%] sm:pl-8 text-left">
                <span className="inline-block bg-[#cc0000] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">2022 – 2023</span>
                <h3 className="text-2xl font-black text-gray-900 leading-snug mb-2">Những bước chân đầu tiên</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Hai dự án tiên phong đặt nền móng cho cộng đồng — mở ra một chương mới đầy nhiệt huyết và sáng tạo của Fairy Tail Việt Nam.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-[#cc0000] uppercase tracking-wider mb-1">Lịch Fairy Tail Chibi (2022)</p>
                    <p className="text-gray-500 text-xs leading-relaxed">Dự án đầu tiên thực hiện bởi họa sĩ Lươn Nướng, hợp tác cùng Fairy Tail Việt Nam. Bộ lịch gồm 12 bức tranh lấy cảm hứng từ các sự kiện trong năm gắn với các giá trị văn hóa Việt Nam - Nhật Bản.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-[#cc0000] uppercase tracking-wider mb-1">Tứ Quý I&amp;II (2023)</p>
                    <p className="text-gray-500 text-xs leading-relaxed">Tứ Quý ra đời với sự hợp tác của họa sĩ Như Thư. Dự án là 4 bức tranh tái hiện lại 4 mùa trong năm, qua đó truyền tải nỗi khắc khoải thời gian trôi đi cùng thông điệp trân trọng từng giây phút.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2024 ── */}
            <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out delay-100 relative flex flex-col sm:flex-row-reverse items-center gap-8 mb-20">
              {/* Image — right */}
              <div className="w-full sm:w-[45%] group relative overflow-hidden rounded-2xl shadow-xl">
                <img src="/About us/6.jpg" alt="Mythical Garden 2024" className="w-full object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-in-out" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#cc0000]" />
              </div>

              {/* Center dot */}
              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 flex-col items-center gap-1 z-10">
                <div className="w-5 h-5 rounded-full bg-[#cc0000] border-4 border-white shadow-lg ring-2 ring-[#cc0000]/30" />
              </div>

              {/* Text — left */}
              <div className="w-full sm:w-[45%] sm:pr-8 text-left sm:text-right">
                <span className="inline-block bg-[#cc0000] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">2024</span>
                <h3 className="text-2xl font-black text-gray-900 leading-snug mb-2">Mythical Garden</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Dress up standee "Mythical Garden - Vườn Thần Thoại" thực hiện bởi họa sĩ Smol Lazuli và đơn vị thiết kế Fairies' Matsuri - Fairy Tail Việt Nam. Bộ sưu tập gồm 4 mẫu nhân vật, lấy ý tưởng từ khu vườn cổ tích trong mơ, nơi bạn hóa thân thành một nhà thám hiểm cùng các ma đạo sĩ.
                </p>
              </div>
            </div>

            {/* ── 2025 – 2026 ── */}
            <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out delay-200 relative flex flex-col sm:flex-row items-center gap-8 mb-20">
              {/* Image — left */}
              <div className="w-full sm:w-[45%] group relative overflow-hidden rounded-2xl shadow-xl">
                <img src="/About us/7.jpg" alt="Móc khóa Phúc Ấn & Lịch Fairy Tail 2026" className="w-full object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-in-out" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#cc0000]" />
              </div>

              {/* Center dot */}
              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 flex-col items-center gap-1 z-10">
                <div className="w-5 h-5 rounded-full bg-[#cc0000] border-4 border-white shadow-lg ring-2 ring-[#cc0000]/30" />
              </div>

              {/* Text — right */}
              <div className="w-full sm:w-[45%] sm:pl-8 text-left">
                <span className="inline-block bg-[#cc0000] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">2025 – 2026</span>
                <h3 className="text-2xl font-black text-gray-900 leading-snug mb-2">Tiếp nối hành trình</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Từ những món quà nhỏ thân thương đến bộ lịch đón năm mới rực rỡ — hai dự án tiếp nối nhau khép lại một chặng đường đầy ý nghĩa.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-[#cc0000] uppercase tracking-wider mb-1">Móc khóa Phúc Ấn (2025)</p>
                    <p className="text-gray-500 text-xs leading-relaxed">Dự án được lấy cảm hứng từ những món quà nhỏ, kèm lời chúc thân thương. Qua bàn tay họa sĩ Nhung Nguyễn, các nhân vật Fairy Tail đang gửi lời chúc đến người hâm mộ.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-xs font-black text-[#cc0000] uppercase tracking-wider mb-1">Lịch Fairy Tail 2026</p>
                    <p className="text-gray-500 text-xs leading-relaxed">Sau thành công của Lịch Fairy Tail 2022, chúng mình tiếp tục kết hợp với họa sĩ Lươn Nướng để mở đầu năm Bính Ngọ đầy rực rỡ.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2026 UPCOMING ── */}
            <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out delay-300 relative flex flex-col sm:flex-row-reverse items-center gap-8">
              {/* Image — right */}
              <div className="w-full sm:w-[45%] group relative overflow-hidden rounded-2xl shadow-xl">
                <img src="/About us/8.jpg" alt="Tứ Quý III 2026" className="w-full object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-in-out" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />
              </div>

              {/* Center dot — yellow for upcoming */}
              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 flex-col items-center gap-1 z-10">
                <div className="w-5 h-5 rounded-full bg-yellow-400 border-4 border-white shadow-lg ring-2 ring-yellow-400/40 animate-pulse" />
              </div>

              {/* Text — left */}
              <div className="w-full sm:w-[45%] sm:pr-8 text-left sm:text-right">
                <h3 className="text-2xl font-black text-gray-900 leading-snug mb-2">Tứ Quý III (2026)</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Tứ Quý luôn được các tiểu tiên tử quan tâm đặc biệt. 2026 đánh dấu sự trở lại với bộ sưu tập mới ra mắt vào mùa hè 2026 đầy sôi động. Hợp tác trở lại với họa sĩ Như Thư — người đứng sau 2 mùa trước — hứa hẹn tạo nên "cơn sốt" mới tại fanstore Fairy Tail Việt Nam.
                </p>
                <div className="flex gap-2 mt-4 sm:justify-end">
                  <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold px-3 py-1 rounded-full">Đang phát triển</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SÁNG TẠO NỘI DUNG  (ảnh 9)
      ══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out text-center mb-14">
            <span className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.4em] mb-3 block">Sáng tạo</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Sáng tạo <span className="text-yellow-400">nội dung</span>
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-5 rounded-full" />
            <p className="text-gray-400 mt-5 max-w-xl mx-auto text-base">
              Chúng mình không ngừng tạo ra những nội dung chất lượng — từ artwork, fanfic đến video edit — mang hơi thở của Fairy Tail đến với cộng đồng Việt Nam.
            </p>
          </div>

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 ease-out delay-100 group relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/About us/9.jpg"
              alt="Sáng tạo nội dung Fairy Tail Việt Nam"
              className="w-full max-h-[520px] object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-10">
              <div>
                <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-2">✨ Content Creation</p>
                <h3 className="text-white text-2xl sm:text-3xl font-black leading-tight max-w-lg">
                  Sáng tạo không ngừng — Truyền cảm hứng mỗi ngày
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER CTA
      ══════════════════════════════════════ */}
      <section className="bg-[#cc0000] py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-700 ease-out">
          <h3 className="text-white text-3xl sm:text-4xl font-black mb-4">Tham gia cùng chúng mình!</h3>
          <p className="text-white/80 text-base mb-8">
            Trở thành một phần của đại gia đình Fairy Tail Việt Nam — nơi mọi đam mê đều được chào đón.
          </p>
          <a
            href="#"
            className="inline-block bg-white text-[#cc0000] font-black text-sm uppercase tracking-widest px-10 py-4 rounded-full hover:bg-yellow-300 hover:text-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Tham gia ngay →
          </a>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;

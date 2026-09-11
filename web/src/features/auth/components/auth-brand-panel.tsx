import Image from "next/image";

import companyLogo from "@/assets/Logo công ty.png";
import illustration from "@/assets/Minh hoạ chuyển động.png";

export function AuthBrandPanel() {
  return (
    <section className="auth-brand-panel">
      <Image className="auth-brand-art" src={illustration} alt="Minh hoạ quy trình quản lý hồ sơ" fill priority sizes="(max-width: 1023px) 100vw, 55vw" />
      <div className="auth-brand-content">
        <div className="auth-brand-identity">
          <Image src={companyLogo} alt="Tân An" width={28} height={28} priority />
          <div>
            <p>TÂN AN</p>
            <span>Quản lý hồ sơ vụ việc</span>
          </div>
        </div>
        <div className="auth-brand-welcome">
          <h1>Xin chào!</h1>
          <p>Hãy sử dụng hệ thống đúng quy trình 5 tầng — mọi thao tác đều được ghi nhật ký.</p>
        </div>
      </div>
    </section>
  );
}

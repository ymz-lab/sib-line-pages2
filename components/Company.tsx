import { FadeUp } from "./motion";

const rows: [string, React.ReactNode][] = [
  ["会社名", "株式会社BaseAI"],
  ["代表取締役", "ロイス リオス"],
  ["所在地", "神奈川県藤沢市"],
  ["設立", "2026年予定（登記日は未確定）"],
  ["資本金", "100万円"],
  ["運営コミュニティ", "SIB（Shonan Innovation Base）"],
  [
    "事業内容",
    <ul key="business" className="space-y-1">
      <li>・経営者コミュニティ</li>
      <li>・学生コミュニティ</li>
      <li>・企業向け実行支援</li>
    </ul>,
  ],
];

export default function Company() {
  return (
    <section className="bg-white pb-20 pt-4 md:pb-28">
      <div className="container-page">
        <FadeUp>
          <div className="border border-line">
            <table className="w-full border-collapse text-left">
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label} className="border-b border-line last:border-b-0">
                    <th className="w-32 shrink-0 whitespace-nowrap bg-bg-soft px-5 py-5 align-top text-sm font-semibold text-primary/60 sm:w-48 sm:px-8">
                      {label}
                    </th>
                    <td className="px-5 py-5 align-top text-sm leading-relaxed text-primary sm:px-8 sm:text-base">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

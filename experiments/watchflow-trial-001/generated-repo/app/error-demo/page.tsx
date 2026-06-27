import { StateView } from "@/components/ui/StateView";

export default function ErrorDemoPage() {
  return (
    <main className="page">
      <StateView title="エラー状態" message="API失敗、オフライン、タイムアウト時の共通表示を確認するための画面です。" />
    </main>
  );
}

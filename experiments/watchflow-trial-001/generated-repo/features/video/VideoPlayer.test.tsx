import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { videos } from "@/lib/mocks/data";
import { VideoPlayer } from "./VideoPlayer";

Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined)
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: vi.fn()
});

describe("動画プレイヤー", () => {
  it("アクセシブルな再生ボタンを表示する", () => {
    render(<VideoPlayer video={videos[0]} />);
    expect(screen.getByRole("button", { name: "再生" })).toBeInTheDocument();
  });

  it("失敗モードでは再試行ボタンを表示する", async () => {
    render(<VideoPlayer video={videos[0]} mediaMode="failure" />);
    const media = document.querySelector("video");
    media?.dispatchEvent(new Event("error"));
    expect(await screen.findByRole("button", { name: /再試行/ })).toBeInTheDocument();
  });

  it("ミュート操作名が切り替わる", async () => {
    const user = userEvent.setup();
    render(<VideoPlayer video={videos[0]} />);
    await user.click(screen.getByRole("button", { name: "ミュート" }));
    expect(screen.getByRole("button", { name: "ミュート解除" })).toBeInTheDocument();
  });
});

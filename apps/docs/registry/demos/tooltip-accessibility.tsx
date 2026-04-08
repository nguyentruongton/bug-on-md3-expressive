import { Button, PlainTooltip, TooltipBox } from "@bug-on/md3-react";

export default function TooltipAccessibility() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-12">
			<div className="max-w-md space-y-4 rounded-xl border border-outline-variant p-6 text-center">
				<h3 className="text-lg font-bold text-on-surface">
					Kiểm tra Tính tiếp cận (A11y)
				</h3>
				<p className="text-sm text-secondary">
					Sử dụng phím <strong>Tab</strong> để di chuyển focus vào nút bên dưới.
					Tooltip sẽ tự động xuất hiện. Nhấn <strong>Escape</strong> để đóng.
				</p>
				<div className="flex justify-center gap-4 py-4">
					<TooltipBox tooltip={<PlainTooltip>Xác nhận đăng ký</PlainTooltip>}>
						<Button colorStyle="filled">Đăng ký ngay</Button>
					</TooltipBox>

					<TooltipBox
						tooltip={
							<PlainTooltip caret={{ enabled: true }}>
								Hủy bỏ và quay lại
							</PlainTooltip>
						}
					>
						<Button colorStyle="text">Hủy bỏ</Button>
					</TooltipBox>
				</div>
				<ul className="list-inside list-disc text-left text-xs text-secondary-container">
					<li>role="tooltip" cho phần nội dung</li>
					<li>aria-describedby liên kết tiêu đề và tooltip</li>
					<li>Hỗ trợ đóng bằng phím ESC</li>
					<li>Xử lý focus/blur mượt mà</li>
				</ul>
			</div>
		</div>
	);
}

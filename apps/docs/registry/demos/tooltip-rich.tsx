import { Button, RichTooltip, TooltipBox } from "@bug-on/md3-react";

export default function TooltipRich() {
	return (
		<div className="flex flex-col items-center justify-center gap-12 py-12">
			<TooltipBox
				tooltip={
					<RichTooltip
						title="Tính năng mới"
						action={
							<div className="flex w-full justify-end gap-2 px-2">
								<Button colorStyle="text">Tìm hiểu thêm</Button>
							</div>
						}
					>
						Rich tooltips cung cấp thêm ngữ cảnh cho người dùng, có thể bao gồm
						tiêu đề và các nút hành động để tương tác trực tiếp.
					</RichTooltip>
				}
				placement="bottom"
			>
				<Button>Di chuột (Rich Tooltip)</Button>
			</TooltipBox>

			<TooltipBox
				tooltip={
					<RichTooltip
						title="Cấp quyền truy cập"
						caret={{ enabled: true }}
						action={
							<div className="mt-2 flex w-full justify-end gap-2">
								<Button colorStyle="text">Cài đặt</Button>
								<Button colorStyle="text">Cho phép</Button>
							</div>
						}
					>
						Rich tooltips có thể chỉ định chính xác vị trí phần tử bằng caret.
						Bấm vào nút này để dùng thử ví dụ kích hoạt bằng Click.
					</RichTooltip>
				}
				placement="top"
				trigger={["click"]}
			>
				<Button colorStyle="tonal">Bấm để xem (Rich + Caret)</Button>
			</TooltipBox>
		</div>
	);
}

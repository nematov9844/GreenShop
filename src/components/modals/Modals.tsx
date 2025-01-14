/** @format */

import React from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setLoginModal, setRegisterModal } from "../../redux/modalSlice";
import Login from "./Login";

export default function Modals() {
	const dispatch = useDispatch();
	const { isOpen } = useSelector((state: RootState) => state.modal);

	const handleClose = () => {
		dispatch(setLoginModal(false));
	};

	return (
		<Modal
			open={isOpen}
			onCancel={handleClose}
			footer={null}
			width={400}
		>
			<Login />
		</Modal>
	);
}

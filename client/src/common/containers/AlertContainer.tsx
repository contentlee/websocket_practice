import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { keyframes } from "@emotion/react";

import SucessIcon from "@assets/success_icon.svg";
import ErrorIcon from "@assets/error_icon.svg";
import WarningIcon from "@assets/warning_icon.svg";
import CloseIcon from "@assets/close_icon.svg";

import { alertAtom, closeAlertAction } from "@atoms/stateAtom";
import Alert from "../components/Alert";
import Icon from "../components/Icon";

const animate = keyframes`
  0%{
    opacity: 0;
    transform: translateY(-10px)
  }
  5%{
    opacity: 1;
    transform: translateY(0)
  }
  95%{
    opacity: 1;
    transform: translateY(0)
  }
  100%{
    opacity: 0;
    transform: translateY(-10px)
  }

`;

const AlertContainer = () => {
  const [alert, setAlert] = useRecoilState(alertAtom);

  const { type, children } = alert;

  const handleClickClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setAlert(closeAlertAction);
  };

  useEffect(() => {
    if (alert.isOpened) {
      const fadeout = setTimeout(() => {
        setAlert(closeAlertAction);
      }, 5000);
      return () => clearTimeout(fadeout);
    }
  }, [alert, setAlert]);

  return (
    alert.isOpened &&
    createPortal(
      <div
        css={{
          zIndex: "1000",
          position: "absolute",
          top: "20px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          animation: `${animate} 4.8s ease-in forwards`,
        }}
      >
        <Alert type={type}>
          {type === "success" && <Icon src={SucessIcon}></Icon>}
          {type === "error" && <Icon src={ErrorIcon}></Icon>}
          {type === "warning" && <Icon src={WarningIcon}></Icon>}

          {children}
          <div
            css={{
              position: "absolute",
              right: "14px",
            }}
          >
            <Icon src={CloseIcon} onClick={handleClickClose}></Icon>
          </div>
        </Alert>
      </div>,
      document.body,
      "alert"
    )
  );
};

export default AlertContainer;

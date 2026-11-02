import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Swal from "sweetalert2";

export const showFieldHelpModal = (title, description, example) => {
    Swal.fire({
        title: `<div class="d-flex align-items-center justify-content-center gap-2">
                    <i class="fa fa-info-circle text-info"></i>
                    <span class="fs-5 fw-bold text-dark">${title}</span>
                </div>`,
        html: `
            <div class="text-start mt-2">
                <div class="mb-3 text-secondary" style="font-size: 14px; line-height: 1.6;">
                    ${description}
                </div>
                ${
                    example
                        ? `<div class="p-3 bg-light rounded border" style="font-size: 13px; line-height: 1.5;">
                            <div class="fw-bold text-primary mb-1">
                                <i class="fa fa-lightbulb text-warning me-1"></i> Ejemplo de uso:
                            </div>
                            <div class="text-dark">${example}</div>
                        </div>`
                        : ""
                }
            </div>
        `,
        icon: null,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#3bafda",
        customClass: {
            popup: "rounded-3 shadow-lg",
        },
    });
};

const FieldHelp = ({ title, description, example, className = "text-info ms-1" }) => {
    return (
        <Tippy content="Clic para ver explicación y ejemplo" arrow={true}>
            <span
                role="button"
                className={`d-inline-flex align-items-center justify-content-center ${className}`}
                style={{ cursor: "pointer", verticalAlign: "middle" }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showFieldHelpModal(title, description, example);
                }}
            >
                <i className="fa fa-info-circle" style={{ fontSize: "13px" }}></i>
            </span>
        </Tippy>
    );
};

export default FieldHelp;

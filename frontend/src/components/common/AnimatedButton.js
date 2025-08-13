import React from "react";
import "./AnimatedButton.css";

const AnimatedButton = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  ripple = true,
  onClick,
  className = "",
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled || loading) return;

    // Ripple effect
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const rippleElement = document.createElement("span");
      rippleElement.className = "ripple-effect";
      rippleElement.style.width = rippleElement.style.height = size + "px";
      rippleElement.style.left = x + "px";
      rippleElement.style.top = y + "px";

      button.appendChild(rippleElement);

      setTimeout(() => {
        rippleElement.remove();
      }, 600);
    }

    if (onClick) onClick(e);
  };

  const buttonClasses = [
    "animated-button",
    `button-${variant}`,
    `button-${size}`,
    loading && "button-loading",
    disabled && "button-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="button-content">
        {loading && (
          <span className="button-spinner">
            <div className="spinner"></div>
          </span>
        )}

        {icon && iconPosition === "left" && !loading && (
          <span className="button-icon button-icon-left">{icon}</span>
        )}

        <span className="button-text">{children}</span>

        {icon && iconPosition === "right" && !loading && (
          <span className="button-icon button-icon-right">{icon}</span>
        )}
      </span>
    </button>
  );
};

// Specialized button variants
export const PrimaryButton = (props) => (
  <AnimatedButton variant="primary" {...props} />
);
export const SecondaryButton = (props) => (
  <AnimatedButton variant="secondary" {...props} />
);
export const SuccessButton = (props) => (
  <AnimatedButton variant="success" {...props} />
);
export const DangerButton = (props) => (
  <AnimatedButton variant="danger" {...props} />
);
export const GhostButton = (props) => (
  <AnimatedButton variant="ghost" {...props} />
);

export default AnimatedButton;

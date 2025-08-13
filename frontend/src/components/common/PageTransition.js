import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./PageTransition.css";

const PageTransition = ({
  children,
  transitionKey,
  type = "fade",
  duration = 300,
  className = "",
}) => {
  const transitionClasses = {
    fade: "page-fade",
    slide: "page-slide",
    scale: "page-scale",
    slideUp: "page-slide-up",
  };

  return (
    <TransitionGroup className={`page-transition-group ${className}`}>
      <CSSTransition
        key={transitionKey}
        timeout={duration}
        classNames={transitionClasses[type]}
        unmountOnExit
        mountOnEnter
      >
        <div className="page-transition-wrapper">{children}</div>
      </CSSTransition>
    </TransitionGroup>
  );
};

// Individual transition components
export const FadeTransition = ({ children, transitionKey, ...props }) => (
  <PageTransition type="fade" transitionKey={transitionKey} {...props}>
    {children}
  </PageTransition>
);

export const SlideTransition = ({ children, transitionKey, ...props }) => (
  <PageTransition type="slide" transitionKey={transitionKey} {...props}>
    {children}
  </PageTransition>
);

export const ScaleTransition = ({ children, transitionKey, ...props }) => (
  <PageTransition type="scale" transitionKey={transitionKey} {...props}>
    {children}
  </PageTransition>
);

export const SlideUpTransition = ({ children, transitionKey, ...props }) => (
  <PageTransition type="slideUp" transitionKey={transitionKey} {...props}>
    {children}
  </PageTransition>
);

export default PageTransition;

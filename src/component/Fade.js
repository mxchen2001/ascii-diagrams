import React, {
    JSXElementConstructor,
    PropsWithChildren,
    useEffect,
    useState,
  } from "react";
  
  export default function Fade(props) {
    const [maxIsVisible, setMaxIsVisible] = useState(0);
    const transitionDuration = props.transitionDuration || 400;
    const delay = props.delay || 50;
    const WrapperTag = props.wrapperTag || "div";
    const ChildTag = props.childTag || "div";
    const visible = typeof props.visible === "undefined" ? true : props.visible;
    const down = props.down ? true : false;
    const length = props.length ? props.length : 20;
    const horizontal = props.horizontal ? 'X' : 'Y';

  
    useEffect(() => {
      let count = React.Children.count(props.children);
      if (!visible) {
        // Animate all children out
        count = 0;
      }
  
      if (count == maxIsVisible) {
        // We're done updating maxVisible, notify when animation is done
        const timeout = setTimeout(() => {
          if (props.onComplete) props.onComplete();
        }, transitionDuration);
        return () => clearTimeout(timeout);
      }
  
      // Move maxIsVisible toward count
      const increment = count > maxIsVisible ? 1 : -1;
      const timeout = setTimeout(() => {
        setMaxIsVisible(maxIsVisible + increment);
      }, delay);
      return () => clearTimeout(timeout);
    }, [
      React.Children.count(props.children),
      delay,
      maxIsVisible,
      visible,
      transitionDuration,
    ]);
  
    return (
      <WrapperTag className={props.className}>
        {React.Children.map(props.children, (child, i) => {
          return (
            <ChildTag
              className={props.childClassName}
              style={{
                transition: `opacity ${transitionDuration}ms, transform ${transitionDuration}ms`,
                transform: maxIsVisible > i ? "none" : (down ? `translate${horizontal}(-${length}px)` : `translate${horizontal}(${length}px)`),
                opacity: maxIsVisible > i ? 1 : 0,
              }}
            >
              {child}
            </ChildTag>
          );
        })}
      </WrapperTag>
    );
  }
  
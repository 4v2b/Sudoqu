import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Square({
  name,
  value,
  actualValue,
  isStatic,
  onSelect,
  isSelected,
  isMismatched
}) {
  const [showMismatch, setShowMismatch] = useState(false);
  const [isSquareStatic, _] = useState(isStatic)

  useEffect(() => {
      setShowMismatch(isMismatched);
  }, [isMismatched]);

  return (
    <div
      className="square"
      style={{ position: "relative" }}
      onClick={() => onSelect(isSelected ? null : name)}
    >
      {isSquareStatic ? (
        <motion.div
          animate={{ scale: [0, 1.1, 1] }}
          transition={{
            delay: Math.random() * 0.5,
            duration: 0.4,
            times: [0, 0.8, 1],
          }}
          className="content-static"
        >
          {value}
        </motion.div>
      ) : (
        <>
          <motion.div
            animate={{
              scale: isSelected ? 1.1 : 1,
              backgroundColor: showMismatch ? "#FF6B6B" : isSelected ? "#e4cca3" : "#FFFFFF",
            }}
            transition={{
              duration: 0.2,
              backgroundColor: showMismatch ? { delay: 0.1, duration: 1 } : { duration: 0.5 },
            }}
            whileTap={{ scale: 0 }}
            className="content"
          />
          <div style={{ position: "absolute" }}>{actualValue}</div>
        </>
      )}
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import "./loader.css"; // подключаем CSS

const Loader = () => {
  return (
    <motion.div
      className="loader-wrapper"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loader" />
    </motion.div>
  );
};

const PageLoading = ({ loading }) => {
  return (
    <div>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
    </div>
  );
};

export default PageLoading;

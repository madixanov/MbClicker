import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import useMbStore from "../../store/mb-store";
import { useNavigate, useLocation } from "react-router-dom";

import gift from "../../assets/icons/gift.png";
import task from "../../assets/icons/task.png";
import empty_stats from "../../assets/icons/empty_stats.png";
import home from "../../assets/icons/home.png";
import stats from "../../assets/icons/stats.png";
import friends from "../../assets/icons/friends.png";

import selected_home from "../../assets/icons/selected-icons/selected-home.png";
import selected_gift from "../../assets/icons/selected-icons/selected-gift.png";
import selected_stats from "../../assets/icons/selected-icons/selected-stats.png";
import selected_task from "../../assets/icons/selected-icons/selected-task.png";
import selected_friends from "../../assets/icons/selected-icons/selected-friends.png";

const RouterIcon = () => {
  const mbCount = useMbStore((state) => state.mbCount);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      defaultIcon: gift,
      selectedIcon: selected_gift,
      label: "GIFT",
      path: "/gift",
      onClick: () => navigate("/gift")
    },
    {
      defaultIcon: task,
      selectedIcon: selected_task,
      label: "TASK",
      path: "/tasks",
      onClick: () => navigate("/tasks")
    },
    {
      defaultIcon: home,
      selectedIcon: selected_home,
      label: "HOME",
      path: "/",
      onClick: () => {
        console.log('HOME')
        navigate("/")}
    },
    {
      defaultIcon: mbCount === 0 ? empty_stats : stats,
      selectedIcon: selected_stats,
      label: "STATS",
      path: '/stats',
      onClick: () => navigate('/stats')
    },
    {
      defaultIcon: friends,
      selectedIcon: selected_friends,
      label: "FRIENDS",
      path: '/friends',
      onClick: () => navigate('/friebds')
    },
  ];

  const pathToIndex = {
    "/": 2,
    "/tasks": 1,
    "/gift": 0,
    "/stats": 3,
    "/friends": 4
  };

  const [selectedIndex, setSelectedIndex] = useState(pathToIndex[location.pathname] ?? 2);
  const [xPosition, setXPosition] = useState(null);
  const [pendingNavigationPath, setPendingNavigationPath] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const containerRef = useRef(null);
  const iconRefs = useRef([]);

  useEffect(() => {
    const icon = iconRefs.current[selectedIndex];
    const container = containerRef.current;

    if (icon && container) {
      const containerRect = container.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const centerX = iconRect.left - containerRect.left + iconRect.width / 2;
      setXPosition(centerX - 39);
    }
  }, [selectedIndex]);

  useEffect(() => {
    const newIndex = pathToIndex[location.pathname];
    if (newIndex !== undefined) {
      setSelectedIndex(newIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      animationComplete &&
      pendingNavigationPath &&
      location.pathname !== pendingNavigationPath
    ) {
      navigate(pendingNavigationPath);
    }

    if (animationComplete) {
      setPendingNavigationPath(null);
      setAnimationComplete(false);
    }

    if (location.pathname === '/exchange' && pendingNavigationPath === '/') {
      navigate('/')
    }
  }, [animationComplete, pendingNavigationPath, navigate, location.pathname]);



  return (
    <>
      <div
        className="router-icons-container"
        ref={containerRef}
        style={{ position: "relative" }}
      >
        {xPosition !== null && (
          <motion.div
            className="selected-background"
            initial={false}
            animate={{ x: xPosition }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onAnimationComplete={() => {
              setAnimationComplete(true);
            }}
          />
        )}

        {menuItems.map((item, index) => (
          <div
            key={index}
            className="icon-wrapper"
            onClick={() => {
              setSelectedIndex(index);
              setPendingNavigationPath(item.path); 
              setAnimationComplete(false); 
            }}
            ref={(el) => (iconRefs.current[index] = el)}
          >
            <div className="icon-item">
              <motion.img
                src={selectedIndex === index ? item.selectedIcon : item.defaultIcon}
                alt={item.label}
                animate={{ scale: selectedIndex === index ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="labels-container">
        {menuItems.map((item, index) => (
          <p key={index}>{item.label}</p>
        ))}
      </div>
    </>
  );
};

export default RouterIcon;

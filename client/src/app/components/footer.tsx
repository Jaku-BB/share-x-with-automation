"use client";

export const Footer = () => {
  return (
    <footer className="text-center">
      <small className="text-neutral-500 text-xs md:text-base">
        &copy; {new Date().getFullYear()}
      </small>
    </footer>
  );
};

interface Props extends React.ComponentProps<'button'> {
  children: React.ReactNode;
}

export const CircleButton = ({ children, className, ...props }: Props) => {
  return (
    <button
      className={` hover:bg-black hover:bg-opacity-20 disabled:hover:bg-transparent w-8 h-8 rounded-full flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface Props extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const CircleButton = ({
  children,
  className,
  size = 'md',
  ...props
}: Props) => {
  return (
    <button
      className={` hover:bg-black hover:bg-opacity-20 disabled:hover:bg-transparent rounded-full flex items-center justify-center ${
        size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

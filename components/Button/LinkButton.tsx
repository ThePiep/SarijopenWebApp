interface Props extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  color?: 'black' | 'blue';
}

const colorMap: Record<Props['color'], string> = {
  black: 'text-black',
  blue: 'text-sky-700',
};

export const LinkButton = ({
  children,
  className,
  color = 'blue',
  ...props
}: Props) => {
  return (
    <button
      className={`${colorMap[color]} disabled:text-gray-400 disabled:hover:bg-transparent  hover:bg-black hover:bg-opacity-20 px-1 rounded-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

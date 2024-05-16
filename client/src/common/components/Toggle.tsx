import { palette } from '@utils/palette';
import { ChangeEvent, MouseEvent, useState } from 'react';

interface Props {
  id: string;
  label?: string;
  defaultValue?: boolean;
  onChange: (_: ChangeEvent) => boolean | Promise<boolean>;
}

const Toggle = ({ id, label = '', defaultValue = false, onChange }: Props) => {
  const [isChecked, setChecked] = useState(defaultValue);
  const handleOnClick = (e: MouseEvent) => {
    e.preventDefault();
    setChecked((c) => !c);
  };

  const handleOnChange = async (e: ChangeEvent) => {
    e.preventDefault();
    const res = await onChange(e);
    if (!res) {
      const checked = !(e.target as HTMLInputElement).checked;
      (e.target as HTMLInputElement).checked = checked;
      setChecked(checked);
    }
  };

  return (
    <div
      css={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="checkbox"
        css={{ display: 'none' }}
        checked={isChecked}
        onChange={handleOnChange}
      />
      <div
        css={{
          padding: '4px',
          width: '40px',
          height: '20px',
          borderRadius: '50px',
          transition: 'all 0.2s',
          background: isChecked ? palette.point.green : palette.gray.gray52,
        }}
        onClick={handleOnClick}
      >
        <div
          css={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            css={{
              position: 'absolute',
              height: '100%',
              aspectRatio: '1/1',
              borderRadius: '50px',
              background: palette.main.wht,
              left: isChecked ? 0 : '20px',
              transition: 'all 0.2s',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toggle;

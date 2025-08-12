import { css } from "@emotion/react";
import { forwardRef, useState } from "react";
import type { InputProps } from "@/components";
import { Eye, EyeOff } from "../assets";
import {
  baseInputStyles,
  endIconStyles,
  errorMessageStyles,
  fullWidthStyle,
  helperTextStyles,
  inputContainerStyles,
  inputWithEndIconStyles,
  inputWithStartIconStyles,
  inputWrapperStyles,
  labelStyles,
  startIconStyles,
  stateStyles,
  variantStyles,
} from "./styles";

/**
 * `Input` 컴포넌트는 다양한 상태, 스타일, 아이콘, 라벨, 헬퍼 텍스트 등을 지원하는
 * 범용 입력 필드입니다. Emotion의 `css`를 사용해 스타일링되며,
 * `forwardRef`를 통해 외부에서 DOM 접근이 가능합니다.
 *
 * @component
 * @example
 * // 기본 사용 예시
 * <Input
 *   placeholder="이름을 입력하세요"
 *   onChange={(e) => console.log(e.target.value)}
 * />
 *
 * @example
 * // 라벨, 에러 메시지, 아이콘 추가 예시
 * <Input
 *   label="비밀번호"
 *   type="password"
 *   required
 *   errorMessage="비밀번호를 입력해주세요"
 *   startIcon={<LockIcon />}
 * />
 *
 * @param {Object} props - Input 컴포넌트 속성
 * @param {"default"} [props.variant="default"] - 인풋 스타일 변형
 * @param {"default" | "error"} [props.state="default"] - 인풋 상태 (기본/에러)
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {boolean} [props.readOnly=false] - 읽기 전용 여부
 * @param {boolean} [props.fullWidth=false] - 가로 전체 너비 여부
 * @param {string} [props.placeholder] - 플레이스홀더 텍스트
 * @param {string} [props.value] - 제어 컴포넌트 값
 * @param {string} [props.defaultValue] - 비제어 컴포넌트 초기값
 * @param {"text" | "password" | "number" | "search"} [props.type="text"] - 인풋 타입
 * @param {boolean} [props.autoFocus=false] - 자동 포커스 여부
 * @param {number} [props.maxLength] - 입력 최대 길이
 * @param {number} [props.minLength] - 입력 최소 길이
 * @param {boolean} [props.required=false] - 필수 입력 여부
 * @param {string} [props.name] - 인풋 이름
 *
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange] - 값 변경 이벤트 핸들러
 * @param {(event: React.FocusEvent<HTMLInputElement>) => void} [props.onFocus] - 포커스 시 이벤트 핸들러
 * @param {(event: React.FocusEvent<HTMLInputElement>) => void} [props.onBlur] - 블러 시 이벤트 핸들러
 * @param {(event: React.KeyboardEvent<HTMLInputElement>) => void} [props.onKeyDown] - 키 입력 이벤트 핸들러
 *
 * @param {string} [props.label] - 인풋 라벨
 * @param {string} [props.helperText] - 보조 설명 텍스트
 * @param {string} [props.errorMessage] - 에러 메시지
 *
 * @param {React.ReactNode} [props.startIcon] - 인풋 왼쪽에 표시할 아이콘
 * @param {React.ReactNode} [props.endIcon] - 인풋 오른쪽에 표시할 아이콘
 *
 * @param {string} [props.className] - 커스텀 클래스명
 * @param {React.Ref<HTMLInputElement>} ref - 인풋 DOM 참조
 *
 * @returns {JSX.Element} 스타일이 적용된 인풋 필드
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      state = "default",
      disabled = false,
      readOnly = false,
      fullWidth = false,
      placeholder,
      value,
      defaultValue,
      type = "text",
      autoFocus = false,
      maxLength,
      minLength,
      required = false,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      label,
      name,
      helperText,
      errorMessage,
      startIcon,
      endIcon,
      className,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputStyles = css`
    ${baseInputStyles}
    ${variantStyles[variant]}
    ${stateStyles[state]}
    ${fullWidth && fullWidthStyle}
    ${startIcon && inputWithStartIconStyles}
    ${endIcon && inputWithEndIconStyles}
    ${(endIcon || type === "password") && inputWithEndIconStyles}
  `;

    const wrapperStyles = css`
    ${inputWrapperStyles}
    ${fullWidth && fullWidthStyle}
  `;

    return (
      <div
        css={wrapperStyles}
        className={className}>
        {label && (
          // biome-ignore lint/a11y/noLabelWithoutControl: <임시>
          <label css={labelStyles}>
            {label}
            {required && (
              <span
                style={{
                  color: "#ef4444",
                }}>
                *
              </span>
            )}
          </label>
        )}

        <div css={inputContainerStyles}>
          {startIcon && <span css={startIconStyles}>{startIcon}</span>}

          <input
            ref={ref}
            css={inputStyles}
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            value={value}
            name={name}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            // biome-ignore lint/a11y/noAutofocus: <임시>
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            {...rest}
          />

          {type === "password" ? (
            // biome-ignore lint/a11y/noStaticElementInteractions: <임시>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <임시>
            <span
              css={endIconStyles}
              onClick={() => setShowPassword(prev => !prev)}
              style={{
                cursor: "pointer",
              }}>
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          ) : (
            endIcon && <span css={endIconStyles}>{endIcon}</span>
          )}
        </div>

        {errorMessage && <span css={errorMessageStyles}>{errorMessage}</span>}

        {helperText && !errorMessage && <span css={helperTextStyles}>{helperText}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

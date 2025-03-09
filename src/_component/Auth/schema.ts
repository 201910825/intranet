import * as z from "zod"

export const formSchema = z.object({
  username: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  password: z.string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "영문과 숫자를 포함해야 합니다"),
  phone: z.string().regex(/^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/, "올바른 전화번호 형식이 아닙니다"),
  role: z.enum(["MANAGER", "CLIENT"]),
  gender: z.enum(["MALE", "FEMALE"]),
  position: z.string().min(1, "직책을 입력해주세요"),
}) 
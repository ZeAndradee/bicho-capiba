"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/UI/Button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateUserSignupForm,
  UserSignupFormData,
} from "@/validators/auth/userSignup";
import { useAuth } from "@/contexts/AuthContext";
import { getApiInstance } from "@/hooks/Api";
import { handleApiError, ErrorState } from "@/utils/ErrorHandler";
import styles from "./page.module.css";

export default function SignupPage() {
  const { setUser, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<UserSignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<ErrorState | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = validateUserSignupForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const api = getApiInstance();
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      const response = await api.post("/users", submitData);

      if (response.data.status === "OK" && response.data.result) {
        const userData = {
          id: response.data.result.uuid,
          fullName: `${response.data.result.firstName} ${response.data.result.lastName}`,
          email: response.data.result.email,
        };

        setUser(userData);
        router.push(
          `/cadastro-sucesso?nome=${encodeURIComponent(formData.firstName)}`
        );
      }
    } catch (error) {
      const errorState = handleApiError(error, {
        409: "Uma conta com este e-mail já está cadastrada.",
        422: "Dados inválidos. Verifique os campos e tente novamente.",
      });
      setApiError(errorState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <h1>Criar sua conta</h1>
          <p>
            Junte-se a nós e ajude a transformar vidas! Cadastre-se para adotar
            seu novo melhor amigo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {apiError && <div className={styles.error}>{apiError.message}</div>}
          <div className={styles.nameRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">Nome *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Seu nome"
                required
              />
              {errors.firstName && (
                <span className={styles.error}>{errors.firstName}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Sobrenome *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Seu sobrenome"
                required
              />
              {errors.lastName && (
                <span className={styles.error}>{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              required
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha *</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 8 caracteres"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar senha *</label>
            <div className={styles.passwordInput}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme sua senha"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.error}>{errors.confirmPassword}</span>
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                Eu concordo com os{" "}
                <Link href="/termos" className={styles.link}>
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" className={styles.link}>
                  Política de Privacidade
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <span className={styles.error}>{errors.agreeToTerms}</span>
            )}
          </div>

          <Button
            variant="primary"
            color="green"
            size="large"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Já tem uma conta?{" "}
            <Link href="/entrar" className={styles.loginLink}>
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

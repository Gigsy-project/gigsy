"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardLogo,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "@/components/ui/shadcn-io/credit-card";
import type { HTMLAttributes } from "react";

interface BinApiResponse {
  BIN: {
    Valid: string;
    Number: number;
    Length: number;
  };
  Scheme: string;
  Type: string;
  Brand: string;
  Prepaid: boolean;
  Country: {
    A2: string;
    A3: string;
    N3: string;
    ISD: string;
    Name: string;
    Continent: string;
  };
  Issuer: {
    Name: string;
    Website: string;
    Phone: string;
  };
}

// Logo genérico para bancos desconocidos
const BankLogo = ({ name }: { name: string }) => (
  <div className="text-white font-bold text-sm uppercase tracking-wider">
    {name}
  </div>
);

const ChaseMark = (props: HTMLAttributes<SVGElement>) => (
  <svg
    viewBox="0 0 465 465"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Card Mark</title>
    <path
      d="M166.497 0.188111C162.143 0.186928 157.966 1.91465 154.885 4.99158C151.804 8.0685 150.071 12.2429 150.066 16.5972V131.586H453.871L315.519 0.223725L166.497 0.188111ZM465 166.372C465.002 164.217 464.578 162.083 463.753 160.092C462.928 158.101 461.718 156.293 460.193 154.771C458.668 153.249 456.857 152.043 454.864 151.222C452.872 150.402 450.737 149.983 448.582 149.989H333.602V453.785L464.946 315.398L465 166.372ZM298.763 464.812C303.11 464.8 307.274 463.065 310.344 459.987C313.413 456.91 315.137 452.74 315.137 448.394V333.419H11.3453L149.674 464.781L298.763 464.812ZM0.247071 298.646C0.246486 300.802 0.670457 302.936 1.49478 304.928C2.31909 306.919 3.52763 308.729 5.05136 310.254C6.57509 311.778 8.38414 312.988 10.3753 313.813C12.3665 314.639 14.5007 315.064 16.6562 315.064H131.645V11.2462L0.264868 149.597L0.247071 298.646Z"
      fill="currentColor"
    />
  </svg>
);

interface CardBankProps {
  initialNumber?: string;
  initialExpiry?: string;
  initialCvv?: string;
  initialName?: string;
}

export const CardBank = ({
  initialNumber = "4757 7447 1880 1226",
  initialExpiry = "07/30",
  initialCvv = "943",
  initialName = "Diego Letelier",
}: CardBankProps) => {
  const [cardNumber, setCardNumber] = useState(initialNumber);
  const [expiryDate, setExpiryDate] = useState(initialExpiry);
  const [cvv, setCvv] = useState(initialCvv);
  const cardName = initialName;
  
  // Estados de edición
  const [editingNumber, setEditingNumber] = useState(false);
  const [editingExpiry, setEditingExpiry] = useState(false);
  const [editingCvv, setEditingCvv] = useState(false);
  
  // Estados de información del banco
  const [bankName, setBankName] = useState("Bank");
  const [cardScheme, setCardScheme] = useState<"Visa" | "Mastercard">("Visa");
  const [cardType, setCardType] = useState<"Debit" | "Credit">("Credit");
  const [isLoading, setIsLoading] = useState(false);

  // Refs para inputs
  const numberInputRef = useRef<HTMLInputElement>(null);
  const expiryInputRef = useRef<HTMLInputElement>(null);
  const cvvInputRef = useRef<HTMLInputElement>(null);

  // Función para obtener información del BIN
  const fetchBinInfo = useCallback(async (bin: string) => {
    if (bin.replace(/\s/g, "").length < 6) return;

    const binDigits = bin.replace(/\s/g, "").substring(0, 6);
    const apiKey = process.env.NEXT_PUBLIC_BINBANK_APIKEY;

    if (!apiKey) {
      console.warn("NEXT_PUBLIC_BINBANK_APIKEY no está configurada");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://data.handyapi.com/bin/${binDigits}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });

      
      if (response.ok) {
        const data: BinApiResponse = await response.json();
        console.log(data);
        
        // Actualizar nombre del banco
        if (data.Issuer) {
          setBankName(data.Issuer);
        }

        console.log(data.Issuer);

        // Actualizar esquema (Visa/Mastercard)
        if (data.Scheme) {
          const scheme = data.Scheme.toLowerCase();
          if (scheme.includes("visa")) {
            setCardScheme("Visa");
          } else if (scheme.includes("mastercard")) {
            setCardScheme("Mastercard");
          }
        }

        // Actualizar tipo (Debit/Credit)
        if (data.Type) {
          const type = data.Type.toLowerCase();
          if (type.includes("debit")) {
            setCardType("Debit");
          } else if (type.includes("credit")) {
            setCardType("Credit");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching BIN info:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para obtener info del BIN cuando cambia el número
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length >= 6) {
      fetchBinInfo(cardNumber);
    }
  }, [cardNumber, fetchBinInfo]);

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  // Formatear fecha de expiración
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Handlers para edición
  const handleNumberDoubleClick = () => {
    setEditingNumber(true);
    setTimeout(() => numberInputRef.current?.focus(), 0);
  };

  const handleExpiryDoubleClick = () => {
    setEditingExpiry(true);
    setTimeout(() => expiryInputRef.current?.focus(), 0);
  };

  const handleCvvDoubleClick = () => {
    setEditingCvv(true);
    setTimeout(() => cvvInputRef.current?.focus(), 0);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setExpiryDate(formatExpiry(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleNumberBlur = () => {
    setEditingNumber(false);
  };

  const handleExpiryBlur = () => {
    setEditingExpiry(false);
  };

  const handleCvvBlur = () => {
    setEditingCvv(false);
  };

  return (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
          {/* Logo del banco */}
          <div className="absolute top-4 left-4">
            <BankLogo name={bankName} />
            {isLoading && (
              <div className="text-xs text-blue-300 mt-1">Cargando...</div>
            )}
          </div>

          {/* Tipo de tarjeta */}
          <div className="absolute top-4 right-4 text-xs text-blue-200 uppercase">
            {cardType}
          </div>

          <CreditCardLogo>
            <ChaseMark className="text-blue-600" />
          </CreditCardLogo>

          <CreditCardChip />

          <CreditCardServiceProvider
            type={cardScheme}
            format="logo"
            className="brightness-0 invert"
          />

          <CreditCardName className="absolute bottom-4 left-4">
            {cardName}
          </CreditCardName>
        </CreditCardFront>

        <CreditCardBack className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
          <CreditCardMagStripe />

          {/* Número de tarjeta editable */}
          <button
            type="button"
            className="absolute bottom-20 left-4 right-4 text-left"
            onDoubleClick={handleNumberDoubleClick}
          >
            <span className="text-[10px] text-blue-300 mb-1 block">NÚMERO DE TARJETA</span>
            {editingNumber ? (
              <input
                ref={numberInputRef}
                type="text"
                value={cardNumber}
                onChange={handleNumberChange}
                onBlur={handleNumberBlur}
                className="w-full bg-transparent text-white text-lg tracking-widest font-mono outline-none border-b border-blue-400"
                placeholder="0000 0000 0000 0000"
              />
            ) : (
              <CreditCardNumber className="cursor-pointer hover:text-blue-200 transition-colors">
                {cardNumber}
              </CreditCardNumber>
            )}
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex gap-8">
            {/* Fecha de expiración editable */}
            <button
              type="button"
              className="flex flex-col text-left"
              onDoubleClick={handleExpiryDoubleClick}
            >
              <span className="text-[10px] text-blue-300 mb-1">VÁLIDO HASTA</span>
              {editingExpiry ? (
                <input
                  ref={expiryInputRef}
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  onBlur={handleExpiryBlur}
                  className="w-20 bg-transparent text-white text-base font-mono outline-none border-b border-blue-400"
                  placeholder="MM/YY"
                />
              ) : (
                <CreditCardExpiry className="cursor-pointer hover:text-blue-200 transition-colors">
                  {expiryDate}
                </CreditCardExpiry>
              )}
            </button>

            {/* CVV editable */}
            <button
              type="button"
              className="flex flex-col text-left"
              onDoubleClick={handleCvvDoubleClick}
            >
              <span className="text-[10px] text-blue-300 mb-1">CVV</span>
              {editingCvv ? (
                <input
                  ref={cvvInputRef}
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  onBlur={handleCvvBlur}
                  className="w-16 bg-transparent text-white text-base font-mono outline-none border-b border-blue-400"
                  placeholder="123"
                />
              ) : (
                <CreditCardCvv className="cursor-pointer hover:text-blue-200 transition-colors">
                  {cvv}
                </CreditCardCvv>
              )}
            </button>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  );
};

export default CardBank;


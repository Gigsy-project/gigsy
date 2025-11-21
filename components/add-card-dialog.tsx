"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardPreview } from "./card-preview";

interface AddCardDialogProps {
  trigger: React.ReactNode;
  onAddCard: (card: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
    isDefault: boolean;
    type: "credit" | "debit";
    provider: "visa" | "mastercard";
    bankName: string;
  }) => void;
}

export const AddCardDialog = ({ trigger, onAddCard }: AddCardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Form data
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Card info from BIN API
  const [cardInfo, setCardInfo] = useState({
    bankName: "Bank",
    scheme: "visa" as "visa" | "mastercard",
    type: "credit" as "credit" | "debit",
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Handle card info updates from CardPreview
  const handleCardInfoUpdate = useCallback(
    (info: {
      bankName: string;
      scheme: "visa" | "mastercard";
      type: "credit" | "debit";
    }) => {
      setCardInfo(info);
    },
    [],
  );

  // Handle form input changes
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      const formatted = formatCardNumber(value);
      setCardNumber(formatted);
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

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value.toUpperCase());
  };

  // Reset card info when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCardInfo({
        bankName: "Bank",
        scheme: "visa",
        type: "credit",
      });
    }
  }, [isOpen]);

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
      setCardInfo({
        bankName: "Bank",
        scheme: "visa",
        type: "credit",
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      return;
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      return;
    }

    if (expiryDate.length !== 5) {
      return;
    }

    if (cvv.length !== 3) {
      return;
    }

    // Add the card
    onAddCard({
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      isDefault: false,
      type: cardInfo.type,
      provider: cardInfo.scheme,
      bankName: cardInfo.bankName,
    });

    // Close dialog
    setIsOpen(false);
  };

  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardName.length > 0 &&
    expiryDate.length === 5 &&
    cvv.length === 3;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
        {/* Floating Form Card */}
        {/* Card Preview */}
        <div className="bg-white rounded-lg shadow-lg border p-6">
        <div className=				"w-full max-w-[400px] scale-70 absolute -top-[190px] left-1/2 -translate-x-1/2">
          <CardPreview
            cardNumber={cardNumber}
            expiryDate={expiryDate}
            cvv={cvv}
            cardName={cardName}
            onCardInfoUpdate={handleCardInfoUpdate}
          />
        </div>
          <DialogHeader className="pb-4">
            <DialogTitle className="text-center">
              Agregar nueva tarjeta
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Ingresa los datos de tu tarjeta. La vista previa se actualiza en
              tiempo real.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de tarjeta</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Nombre del titular</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="NOMBRE DEL TITULAR"
                value={cardName}
                onChange={handleCardNameChange}
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Fecha de vencimiento</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                Agregar tarjeta
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;

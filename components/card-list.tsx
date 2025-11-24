"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  MoreHorizontal,
  CreditCard,
  Star,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCardDialog } from "./add-card-dialog";

interface UserCard {
  id: number;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
  type: "credit" | "debit";
  provider: "visa" | "mastercard";
  bankName: string;
}

interface CardListProps {
  cards: UserCard[];
  onRemoveCard: (id: number) => void;
  onSetDefaultCard: (id: number) => void;
  onAddCard: (card: Omit<UserCard, "id">) => void;
}

export const CardList = ({
  cards,
  onRemoveCard,
  onSetDefaultCard,
  onAddCard,
}: CardListProps) => {
  const t = useTranslations("walletPage");
  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return `•••• •••• •••• ${cleaned.slice(-4)}`;
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "visa":
        return (
          <div className="w-12 h-7 bg-blue-700 text-white text-sm font-black flex items-center justify-center rounded-sm tracking-wide shadow-sm border">
            VISA
          </div>
        );
      case "mastercard":
        return (
          <div className="w-12 h-7 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black flex items-center justify-center rounded-sm tracking-wide shadow-sm border">
            MC
          </div>
        );
      default:
        return <CreditCard className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-16">
            <CreditCard className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {t("noCardsAssociated")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {t("addCardDescription")}
            </p>
            <AddCardDialog
              onAddCard={onAddCard}
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("addCard")}
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{t("myCards")}</CardTitle>
        <AddCardDialog
          onAddCard={onAddCard}
          trigger={
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("addCard")}
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("card")}</TableHead>
              <TableHead>{t("number")}</TableHead>
              <TableHead>{t("holder")}</TableHead>
              <TableHead>{t("expiry")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getProviderIcon(card.provider)}
                    <div>
                      <div className="font-medium text-sm">{card.bankName}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {card.type}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {maskCardNumber(card.cardNumber)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{card.cardName}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{card.expiryDate}</span>
                </TableCell>
                <TableCell>
                  {card.isDefault ? (
                    <Badge variant="default" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {t("default")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {t("secondary")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!card.isDefault && (
                        <DropdownMenuItem
                          onClick={() => onSetDefaultCard(card.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t("setAsDefault")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onRemoveCard(card.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CardList;

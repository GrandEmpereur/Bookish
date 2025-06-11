import { useState } from "react";
import { Copy, ExternalLink, Twitter, Linkedin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Post } from "@/types/postTypes";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

export const ShareDialog = ({ open, onOpenChange, post }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  // Générer les URLs
  const postUrl = `${window.location.origin}/feed/${post.id}`;
  const shareText = `Découvrez ce post de ${post.user?.username} sur Bookish`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success("Lien copié dans le presse-papiers");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Impossible de copier le lien");
    }
  };

  const shareOptions = [
    {
      name: "X (Twitter)",
      icon: Twitter,
      color: "bg-black hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${shareText}\n\n${postUrl}`)}`,
    },
  ];

  const openShareWindow = (url: string) => {
    window.open(
      url,
      "_blank",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );
  };

  const openInNewTab = () => {
    window.open(postUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager ce post</DialogTitle>
          <DialogDescription>
            Partagez ce post de {post.user?.username} avec vos amis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL du post */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Lien du post</label>
            <div className="flex gap-2">
              <Input
                value={postUrl}
                readOnly
                className="flex-1"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copié !" : "Copier"}
              </Button>
            </div>
          </div>

          {/* Bouton pour ouvrir dans un nouvel onglet */}
          <Button
            variant="outline"
            onClick={openInNewTab}
            className="w-full flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ouvrir dans un nouvel onglet
          </Button>

          {/* Options de partage social */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Partager sur</label>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.name}
                    variant="outline"
                    onClick={() => openShareWindow(option.url)}
                    className={`flex items-center gap-2 text-white ${option.color} border-0`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Aperçu du post */}
          <div className="border rounded-lg p-3 bg-muted/50">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium">
                  {post.user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{post.user?.username}</p>
                <p className="text-sm text-muted-foreground font-medium">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {post.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

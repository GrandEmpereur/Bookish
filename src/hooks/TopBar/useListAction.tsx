import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getListById } from "@/services/listsService";

const useListInfo = () => {
  const pathname = usePathname();
  const [listName, setListName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Vérifier si on est sur une page spécifique
  const isCreateList = /^\/lists\/create\/?$/.test(pathname);
  const isEditList = /^\/lists\/[^\/]+\/edit\/?$/.test(pathname);
  const isListPage = /^\/lists\/[^\/]+\/?$/.test(pathname);

  // Extraire l'ID de la liste
  const match = pathname.match(/^\/lists\/([^\/]+)/);
  const listId = match ? match[1] : null;

  // Charger le nom de la liste
  useEffect(() => {
    if (listId && !isCreateList) {
      setLoading(true);
      getListById(listId)
        .then((response) => setListName(response.data.name))
        .catch((error) => console.error("Erreur récupération liste:", error))
        .finally(() => setLoading(false));
    }
  }, [listId, isCreateList]);

  return { listName, loading, isCreateList, isEditList, isListPage, listId };
};

export default useListInfo;

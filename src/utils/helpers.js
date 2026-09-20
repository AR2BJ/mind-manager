export function generateId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  function getRandomHex(length) {
    let result = "";
    const chars = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  const timestamp = getRandomHex(32).toString(16).padStart(12, "0");
  const randomPart = getRandomHex(8);

  const timeLow = timestamp.slice(0, 8);
  const timeMid = timestamp.slice(8, 12);
  const timeHiAndVersion = "4" + getRandomHex(3);
  const clockSeqHiAndReserved = getRandomHex(3);
  const node = getRandomHex(6) + randomPart.slice(0, 6);

  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}-${node}`;
}

export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return formatDate(new Date());
}

export function mapTagIdsToObjects(tagIds = [], globalTags = []) {
  if (!Array.isArray(tagIds)) return [];
  return tagIds
    .map((id) => globalTags.find((t) => t.id === id))
    .filter(Boolean);
}

// utils/helpers.js

export function processTagPipeline(
  componentItems = [],
  existingTags = [],
  entityType = null,
) {
  const updatedGlobalTags = existingTags.map((tag) => ({ ...tag }));
  const assignedTagIds = [];

  componentItems.forEach((item) => {
    const isNewFlag = typeof item === "object" && (item.isNew || !item.id);
    const itemTitle = typeof item === "object" ? item.name : item;

    if (!itemTitle) return;

    const normalizedTitle = itemTitle.trim().toLowerCase();

    let match = null;
    if (typeof item === "object" && item.id && !isNewFlag) {
      match = updatedGlobalTags.find((t) => t.id === item.id);
    }

    if (!match) {
      match = updatedGlobalTags.find(
        (t) => t.name.toLowerCase() === normalizedTitle,
      );
    }

    if (isNewFlag && !match) {
      const newTag = {
        id: generateId(),
        name: itemTitle.trim(),
        entityType: entityType,
      };
      updatedGlobalTags.push(newTag);
      assignedTagIds.push(newTag.id);
    } else if (match) {
      if (!match.entityType && entityType) {
        match.entityType = entityType;
      }
      assignedTagIds.push(match.id);
    }
  });

  return {
    assignedTagIds,
    updatedGlobalTags,
  };
}

export function syncTagEntityTypes(
  tags = [],
  entityType = null,
  entityItems = [],
) {
  if (!entityType || !Array.isArray(entityItems)) return tags;

  const activeTagIdsInEntity = new Set(
    entityItems.flatMap((item) => item.tagIds || []),
  );

  return tags.map((tag) => {
    if (tag.entityType === entityType && !activeTagIdsInEntity.has(tag.id)) {
      return { ...tag, entityType: null };
    }
    return tag;
  });
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

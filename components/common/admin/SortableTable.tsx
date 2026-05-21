'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';

export type SortableRowContext = {
  canDrag: boolean;
  dragHandle: ReactNode | null;
  isDragging: boolean;
  displayIndex: number;
};

type SortableTableProps<T extends { id: string }> = {
  items: T[];
  onReorder: (orderedIds: string[]) => Promise<{ success: boolean; error?: string }>;
  header: ReactNode;
  renderRow: (item: T, context: SortableRowContext) => ReactNode;
};

export function SortableDragHandle({
  attributes,
  listeners,
  disabled
}: {
  attributes: ReturnType<typeof useSortable>['attributes'];
  listeners: ReturnType<typeof useSortable>['listeners'];
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground',
        'hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'active:cursor-grabbing',
        disabled && 'pointer-events-none opacity-50'
      )}
      aria-label="Drag to reorder"
      disabled={disabled}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );
}

function SortableTableRow({
  id,
  displayIndex,
  saveDisabled,
  children
}: {
  id: string;
  displayIndex: number;
  saveDisabled: boolean;
  children: (context: SortableRowContext) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: saveDisabled });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition
  };

  const context: SortableRowContext = {
    canDrag: true,
    dragHandle: (
      <SortableDragHandle
        attributes={attributes}
        listeners={listeners}
        disabled={saveDisabled}
      />
    ),
    isDragging,
    displayIndex
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && 'relative z-10 bg-muted/60 opacity-90')}
    >
      <TableCell className="w-12">{context.dragHandle}</TableCell>
      {children(context)}
    </TableRow>
  );
}

export function SortableTable<T extends { id: string }>({
  items: initialItems,
  onReorder,
  header,
  renderRow
}: SortableTableProps<T>) {
  const [items, setItems] = useState(initialItems);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const canDrag = items.length > 1;
  const itemIds = items.map((item) => item.id);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previousItems = items;
    const nextItems = arrayMove(items, oldIndex, newIndex);
    setItems(nextItems);
    setIsSaving(true);

    try {
      const result = await onReorder(nextItems.map((item) => item.id));
      if (!result.success) {
        setItems(previousItems);
        alert(result.error ?? 'Failed to save order');
      }
    } catch {
      setItems(previousItems);
      alert('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  }

  const staticContext = (index: number): SortableRowContext => ({
    canDrag: false,
    dragHandle: null,
    isDragging: false,
    displayIndex: index
  });

  const table = (
    <EntityTableShell>
      <Table>
        {header}
        <TableBody>
          {canDrag
            ? items.map((item, index) => (
                <SortableTableRow
                  key={item.id}
                  id={item.id}
                  displayIndex={index}
                  saveDisabled={isSaving}
                >
                  {(context) => renderRow(item, context)}
                </SortableTableRow>
              ))
            : items.map((item, index) => (
                <TableRow key={item.id}>
                  {renderRow(item, staticContext(index))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );

  return (
    <div className="space-y-2">
      {isSaving ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Saving order…
        </p>
      ) : null}
      {canDrag ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            {table}
          </SortableContext>
        </DndContext>
      ) : (
        table
      )}
    </div>
  );
}

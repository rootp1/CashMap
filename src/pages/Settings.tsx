import { useState } from 'react';
import { Bell, DollarSign, Palette, Info, Plus, Minus, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppState } from '@/hooks/useAppState';
import { useToast } from '@/hooks/use-toast';

export function Settings() {
  const { state, updateState } = useAppState();
  const { toast } = useToast();
  const [tempLimit, setTempLimit] = useState(state.settings.dailyLimit.toString());

  const handleLimitSave = () => {
    const newLimit = parseInt(tempLimit);
    if (newLimit > 0) {
      updateState({
        settings: {
          ...state.settings,
          dailyLimit: newLimit,
        },
      });
      toast({
        title: "Daily limit updated",
        description: `New limit set to ₹${newLimit}`,
      });
    }
  };

  const handleNotificationToggle = (type: 'warning' | 'exceeded') => {
    updateState({
      settings: {
        ...state.settings,
        [type === 'warning' ? 'notifyWarning' : 'notifyExceeded']: 
          !state.settings[type === 'warning' ? 'notifyWarning' : 'notifyExceeded'],
      },
    });
    
    // Simulate notification
    toast({
      title: type === 'warning' ? 'Warning notifications' : 'Exceeded notifications',
      description: `${type === 'warning' ? 'Warning' : 'Exceeded'} notifications ${
        state.settings[type === 'warning' ? 'notifyWarning' : 'notifyExceeded'] ? 'disabled' : 'enabled'
      }`,
    });
  };

  const addCategory = () => {
    if (state.categories.length >= 8) {
      toast({
        title: "Maximum categories reached",
        description: "You can have up to 8 categories",
        variant: "destructive",
      });
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: `Category ${state.categories.length + 1}`,
      iconKey: 'MoreHorizontal',
      order: state.categories.length,
      active: true,
    };

    updateState({
      categories: [...state.categories, newCategory],
    });
  };

  const removeCategory = (categoryId: string) => {
    if (state.categories.length <= 1) {
      toast({
        title: "Cannot remove category",
        description: "You must have at least one category",
        variant: "destructive",
      });
      return;
    }

    updateState({
      categories: state.categories.filter(c => c.id !== categoryId),
    });
  };

  const renameCategory = (categoryId: string, newName: string) => {
    updateState({
      categories: state.categories.map(c =>
        c.id === categoryId ? { ...c, name: newName } : c
      ),
    });
  };

  const getIconForCategory = (iconKey: string) => {
    switch (iconKey) {
      case 'Car': return '🚗';
      case 'Utensils': return '🍽️';
      case 'ShoppingBag': return '🛍️';
      case 'ShoppingCart': return '🛒';
      default: return '📋';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hidden">
        {/* Limits & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Limits & Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="daily-limit">Daily Limit (₹)</Label>
              <div className="flex space-x-2">
                <Input
                  id="daily-limit"
                  type="number"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleLimitSave} size="sm">
                  Save
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Warning at</Label>
                <p className="text-muted-foreground">{state.settings.warningThreshold}%</p>
              </div>
              <div>
                <Label>Exceeded at</Label>
                <p className="text-muted-foreground">{state.settings.exceededThreshold}%</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label>Notify at warning</Label>
                </div>
                <Switch
                  checked={state.settings.notifyWarning}
                  onCheckedChange={() => handleNotificationToggle('warning')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label>Notify when exceeded</Label>
                </div>
                <Switch
                  checked={state.settings.notifyExceeded}
                  onCheckedChange={() => handleNotificationToggle('exceeded')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Categories</span>
              </CardTitle>
              <Button onClick={addCategory} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.categories.map((category, index) => (
              <div key={category.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg">{getIconForCategory(category.iconKey)}</span>
                <Input
                  value={category.name}
                  onChange={(e) => renameCategory(category.id, e.target.value)}
                  className="flex-1 h-8"
                />
                {state.categories.length > 1 && (
                  <Button
                    onClick={() => removeCategory(category.id)}
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-danger"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <p className="text-xs text-muted-foreground mt-2">
              Min 1, max 8 categories. Drag to reorder.
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Support</span>
              <span className="text-primary">help@financetracker.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Privacy Policy</span>
              <span className="text-primary">View</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
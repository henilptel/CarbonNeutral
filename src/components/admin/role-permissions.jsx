import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const RolePermissions = () => {
  const [permissions, setPermissions] = useState({
    admin: {
      dashboard: {
        view: true,
        export: true,
      },
      emissions: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
      sinks: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
      simulation: {
        view: true,
        create: true,
      },
      reports: {
        view: true,
        create: true,
        export: true,
      },
      users: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
    },
    analyst: {
      dashboard: {
        view: true,
        export: true,
      },
      emissions: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      sinks: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      simulation: {
        view: true,
        create: true,
      },
      reports: {
        view: true,
        create: true,
        export: true,
      },
      users: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    },
    officer: {
      dashboard: {
        view: true,
        export: false,
      },
      emissions: {
        view: true,
        create: true,
        edit: false,
        delete: false,
      },
      sinks: {
        view: true,
        create: true,
        edit: false,
        delete: false,
      },
      simulation: {
        view: true,
        create: false,
      },
      reports: {
        view: true,
        create: false,
        export: false,
      },
      users: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    },
  });
  
  const [activeRole, setActiveRole] = useState("admin");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handlePermissionChange = (module, permission, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [module]: {
          ...prev[activeRole][module],
          [permission]: checked,
        },
      },
    }));
  };
  
  const handleSavePermissions = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Permissions Updated",
        description: `Permissions for ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} role have been updated.`,
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        {Object.keys(permissions).map((role) => (
          <Button
            key={role}
            variant={activeRole === role ? "default" : "outline"}
            onClick={() => setActiveRole(role)}
            className="capitalize"
          >
            {role}
          </Button>
        ))}
      </div>
      
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Module
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                View
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Create
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Edit
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Delete
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Export
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Object.entries(permissions[activeRole]).map(([module, perms]) => (
              <tr key={module}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium capitalize">
                  {module}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {perms.view !== undefined && (
                    <div className="flex justify-center">
                      <Checkbox
                        checked={perms.view}
                        onCheckedChange={(checked) => handlePermissionChange(module, "view", checked)}
                      />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {perms.create !== undefined && (
                    <div className="flex justify-center">
                      <Checkbox
                        checked={perms.create}
                        onCheckedChange={(checked) => handlePermissionChange(module, "create", checked)}
                      />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {perms.edit !== undefined && (
                    <div className="flex justify-center">
                      <Checkbox
                        checked={perms.edit}
                        onCheckedChange={(checked) => handlePermissionChange(module, "edit", checked)}
                      />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {perms.delete !== undefined && (
                    <div className="flex justify-center">
                      <Checkbox
                        checked={perms.delete}
                        onCheckedChange={(checked) => handlePermissionChange(module, "delete", checked)}
                      />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {perms.export !== undefined && (
                    <div className="flex justify-center">
                      <Checkbox
                        checked={perms.export}
                        onCheckedChange={(checked) => handlePermissionChange(module, "export", checked)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSavePermissions} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Permissions
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">Role Description</h4>
        <p className="text-sm text-muted-foreground">
          {activeRole === "admin" && "Administrators have full access to all features and can manage users and system settings."}
          {activeRole === "analyst" && "Data Analysts can view and analyze data, create reports, and make recommendations, but cannot manage users or system settings."}
          {activeRole === "officer" && "Environmental Officers can submit data and view reports, but have limited access to analysis tools and no access to system settings."}
        </p>
      </div>
    </div>
  );
};

export default RolePermissions;
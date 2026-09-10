namespace VDungCoffe.Security;

public static class Permissions
{
    // Product permissions
    public const string ProductsView = "Permissions.Products.View";
    public const string ProductsCreate = "Permissions.Products.Create";
    public const string ProductsEditGeneral = "Permissions.Products.EditGeneral"; // Can edit description, name, media, specs
    public const string ProductsEditPrice = "Permissions.Products.EditPrice";     // Can change price or price mode
    public const string ProductsDelete = "Permissions.Products.Delete";           // Soft delete / archive
    public const string ProductsPublish = "Permissions.Products.Publish";         // Publish / unpublish draft

    // Inventory permissions
    public const string InventoryView = "Permissions.Inventory.View";
    public const string InventoryUpdate = "Permissions.Inventory.Update";

    // Category permissions
    public const string CategoriesView = "Permissions.Categories.View";
    public const string CategoriesManage = "Permissions.Categories.Manage";

    // Brand permissions
    public const string BrandsView = "Permissions.Brands.View";
    public const string BrandsManage = "Permissions.Brands.Manage";

    // Order permissions
    public const string OrdersView = "Permissions.Orders.View";
    public const string OrdersUpdateStatus = "Permissions.Orders.UpdateStatus";

    // Customer permissions
    public const string CustomersView = "Permissions.Customers.View";
    public const string CustomersManage = "Permissions.Customers.Manage";

    // Article permissions
    public const string ArticlesView = "Permissions.Articles.View";
    public const string ArticlesCreate = "Permissions.Articles.Create";
    public const string ArticlesEdit = "Permissions.Articles.Edit";
    public const string ArticlesPublish = "Permissions.Articles.Publish";
    public const string ArticlesDelete = "Permissions.Articles.Delete";

    // Contact inquiries
    public const string ContactsView = "Permissions.Contacts.View";
    public const string ContactsManage = "Permissions.Contacts.Manage";

    // Audit logs
    public const string AuditLogsView = "Permissions.AuditLogs.View";

    public static readonly IReadOnlyList<string> AllPermissions = new List<string>
    {
        ProductsView, ProductsCreate, ProductsEditGeneral, ProductsEditPrice, ProductsDelete, ProductsPublish,
        InventoryView, InventoryUpdate,
        CategoriesView, CategoriesManage,
        BrandsView, BrandsManage,
        OrdersView, OrdersUpdateStatus,
        CustomersView, CustomersManage,
        ArticlesView, ArticlesCreate, ArticlesEdit, ArticlesPublish, ArticlesDelete,
        ContactsView, ContactsManage,
        AuditLogsView
    };

    // Pre-configured role permission templates
    public static class RoleDefaults
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string AdminAssistant = "AdminAssistant"; // e.g. "admin phụ"
        public const string ContentEditor = "ContentEditor";

        // AdminAssistant: can view products, edit description, view orders, view categories.
        // CANNOT change price, CANNOT delete products, CANNOT change inventory.
        public static readonly IReadOnlyList<string> AdminAssistantPermissions = new List<string>
        {
            ProductsView, ProductsEditGeneral,
            CategoriesView,
            BrandsView,
            OrdersView,
            ArticlesView, ArticlesCreate, ArticlesEdit,
            ContactsView
        };

        // ContentEditor: handles blog/news articles and descriptions
        public static readonly IReadOnlyList<string> ContentEditorPermissions = new List<string>
        {
            ProductsView, ProductsEditGeneral,
            ArticlesView, ArticlesCreate, ArticlesEdit, ArticlesPublish
        };
    }
}

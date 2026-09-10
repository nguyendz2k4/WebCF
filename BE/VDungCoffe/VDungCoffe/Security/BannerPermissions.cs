namespace VDungCoffe.Security;
public static class BannerPermissions
{
    public const string View = "Permissions.Banners.View";
    public const string Create = "Permissions.Banners.Create";
    public const string Edit = "Permissions.Banners.Edit";
    public const string Publish = "Permissions.Banners.Publish";
    public const string Delete = "Permissions.Banners.Delete";
    public static readonly IReadOnlyList<string> AllPermissions = new[] { View, Create, Edit, Publish, Delete };
}

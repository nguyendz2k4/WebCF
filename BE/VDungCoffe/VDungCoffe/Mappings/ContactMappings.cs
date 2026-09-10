using VDungCoffe.DTO.Admin.Contacts;
using VDungCoffe.Models;

namespace VDungCoffe.Mappings;

public static class ContactMappings
{
    public static AdminContactResponse ToAdminDto(this ContactInquiry contact)
    {
        return new AdminContactResponse
        {
            Id = contact.Id,
            Version = Convert.ToBase64String(contact.Version ?? []),
            FullName = contact.FullName,
            Email = contact.Email,
            Phone = contact.Phone,
            BusinessName = contact.BusinessName,
            ServiceType = contact.ServiceType,
            BudgetRange = contact.BudgetRange ?? string.Empty,
            Message = contact.Message ?? string.Empty,
            Status = contact.Status,
            CreatedAt = contact.CreatedAt
        };
    }

    public static Dictionary<string, object?> ToAdminRow(this ContactInquiry contact)
    {
        return new Dictionary<string, object?>
        {
            ["id"] = contact.Id.ToString(),
            ["name"] = contact.FullName,
            ["email"] = contact.Email,
            ["phone"] = contact.Phone,
            ["subject"] = $"{contact.ServiceType} - {contact.BusinessName ?? "Cá nhân"}",
            ["status"] = contact.Status,
            ["description"] = contact.Message ?? string.Empty
        };
    }
}

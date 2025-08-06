import { toast } from 'react-toastify';

class NotificationService {
  // إعدادات عامة للإشعارات
  static defaultConfig = {
    position: 'bottom-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    rtl: true,
    style: {
      direction: 'rtl',
      textAlign: 'right',
      fontFamily: 'inherit'
    }
  };

  // متغير لتتبع آخر إشعار خطأ لتجنب التكرار
  static lastErrorNotification = null;

  // رسالة خطأ
  static showError(title = 'خطأ!', message = 'حدث خطأ ما') {
    const notificationKey = `${title}-${message}`;
    
    // تجنب تكرار نفس الإشعار
    if (this.lastErrorNotification === notificationKey) {
      return;
    }
    
    this.lastErrorNotification = notificationKey;
    
    return toast.error(`${title}\n${message}`, {
      ...this.defaultConfig,
      autoClose: 5000,
      style: {
        ...this.defaultConfig.style,
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca'
      }
    });
  }

  // رسالة نجاح
  static showSuccess(title = 'نجح!', message = 'تمت العملية بنجاح') {
    return toast.success(`${title}\n${message}`, {
      ...this.defaultConfig,
      autoClose: 3000,
      style: {
        ...this.defaultConfig.style,
        background: '#f0fdf4',
        color: '#059669',
        border: '1px solid #bbf7d0'
      }
    });
  }

  // رسالة تحذير
  static showWarning(title = 'تحذير!', message = 'يرجى الانتباه') {
    return toast.warning(`${title}\n${message}`, {
      ...this.defaultConfig,
      style: {
        ...this.defaultConfig.style,
        background: '#fffbeb',
        color: '#f59e0b',
        border: '1px solid #fed7aa'
      }
    });
  }

  // رسالة معلومات
  static showInfo(title = 'معلومات', message = 'معلومات مهمة') {
    return toast.info(`${title}\n${message}`, {
      ...this.defaultConfig,
      style: {
        ...this.defaultConfig.style,
        background: '#eff6ff',
        color: '#3b82f6',
        border: '1px solid #bfdbfe'
      }
    });
  }

  // رسالة تأكيد (للتأكيدات البسيطة)
  static showConfirm(title = 'تأكيد', message = 'هل أنت متأكد من هذا الإجراء؟') {
    return toast(`${title}\n${message}`, {
      ...this.defaultConfig,
      style: {
        ...this.defaultConfig.style,
        background: '#f0f9ff',
        color: '#0ea5e9',
        border: '1px solid #7dd3fc'
      }
    });
  }

  // رسالة خطأ الشبكة/الخادم
  static showNetworkError(message = 'لا يمكن الاتصال بالخادم') {
    return toast.error(`خطأ في الاتصال\n${message}`, {
      ...this.defaultConfig,
      autoClose: 8000, // إغلاق أبطأ للرسائل المهمة
      style: {
        ...this.defaultConfig.style,
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca'
      }
    });
  }

  // رسالة خطأ الخادم
  static showServerError(message = 'خطأ في الخادم') {
    return toast.error(`خطأ في الخادم\n${message}`, {
      ...this.defaultConfig,
      autoClose: 8000,
      style: {
        ...this.defaultConfig.style,
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca'
      }
    });
  }

  // رسالة تحميل
  static showLoading(title = 'جاري التحميل...') {
    return toast.loading(title, {
      ...this.defaultConfig,
      style: {
        ...this.defaultConfig.style,
        background: '#f8fafc',
        color: '#64748b',
        border: '1px solid #e2e8f0'
      }
    });
  }

  // إغلاق الإشعار الحالي
  static close() {
    toast.dismiss();
  }

  // رسالة خطأ تسجيل الدخول
  static showLoginError(message) {
    return this.showError('خطأ في تسجيل الدخول', message);
  }

  // رسالة نجاح تسجيل الدخول
  static showLoginSuccess() {
    return this.showSuccess('تم تسجيل الدخول بنجاح!', 'مرحباً بك في النظام');
  }

  // رسالة نجاح تسجيل الخروج
  static showLogoutSuccess() {
    return this.showSuccess('تم تسجيل الخروج بنجاح!', 'شكراً لاستخدام النظام');
  }

  // رسالة تأكيد تسجيل الخروج
  static showLogoutConfirm() {
    return this.showConfirm(
      'تأكيد تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟'
    );
  }

  // دالة مساعدة للتأكيدات المعقدة (يمكن استخدامها مع window.confirm)
  static async confirmAction(title = 'تأكيد', message = 'هل أنت متأكد؟') {
    return new Promise((resolve) => {
      const result = window.confirm(`${title}\n${message}`);
      resolve(result);
    });
  }

  // دالة لإعادة تعيين متغير التتبع
  static resetErrorTracking() {
    this.lastErrorNotification = null;
  }

  // دالة مساعدة للتعامل مع أنواع مختلفة من الأخطاء
  static handleError(error) {
    const errorMessage = error.message || error;
    
    // تجنب تكرار نفس الخطأ
    const notificationKey = `error-${errorMessage}`;
    if (this.lastErrorNotification === notificationKey) {
      return;
    }
    
    this.lastErrorNotification = notificationKey;
    
    if (errorMessage.includes('لا يمكن الاتصال بالخادم') || 
        errorMessage.includes('خطأ في الاتصال') ||
        errorMessage.includes('Network Error') ||
        errorMessage.includes('الخادم غير متاح')) {
      return this.showNetworkError(errorMessage);
    } else if (errorMessage.includes('خطأ في الخادم') || 
               errorMessage.includes('حدث خطأ في الخادم') ||
               errorMessage.includes('500')) {
      return this.showServerError(errorMessage);
    } else if (errorMessage.includes('غير مصرح') || 
               errorMessage.includes('401') ||
               errorMessage.includes('يجب تسجيل الدخول')) {
      return this.showError('خطأ في الصلاحيات', errorMessage);
    } else if (errorMessage.includes('ممنوع') || 
               errorMessage.includes('403')) {
      return this.showError('ممنوع الوصول', errorMessage);
    } else if (errorMessage.includes('غير موجود') || 
               errorMessage.includes('404')) {
      return this.showError('المورد غير موجود', errorMessage);
    } else if (errorMessage.includes('انتهت مهلة') || 
               errorMessage.includes('timeout')) {
      return this.showError('انتهت مهلة الاتصال', errorMessage);
    } else {
      return this.showError('خطأ', errorMessage);
    }
  }

}

export default NotificationService; 